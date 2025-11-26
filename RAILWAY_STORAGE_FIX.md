# Fix Railway Storage Issue

## Problem

Backend and Worker are separate containers in Railway. When a file is uploaded to backend's `/app/uploads`, the worker cannot access it because it's in a different container.

Error: `Input file not found: /app/uploads/Catholic_Telugu_devotional_Classical_Prayer_dance_Convocation_30_11_2022.mp4`

## Solution Options

### Option 1: Railway Volumes (Recommended if available)

Railway now supports persistent volumes. Both services can mount the same volume.

1. Create a volume in Railway
2. Mount it to both backend and worker at `/app/uploads`
3. Set `STORAGE_PATH=/app/uploads` in both services

### Option 2: Use S3-Compatible Storage (Best for Production)

Use Railway's Cloudflare R2 or AWS S3 for file storage.

#### Implementation Steps:

1. **Install AWS SDK**

   ```bash
   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
   ```

2. **Environment Variables** (Both Backend & Worker)

   ```
   STORAGE_TYPE=s3
   S3_BUCKET_NAME=youtubesync-files
   S3_REGION=auto
   S3_ENDPOINT=https://YOUR-ACCOUNT.r2.cloudflarestorage.com
   S3_ACCESS_KEY_ID=your-access-key
   S3_SECRET_ACCESS_KEY=your-secret-key
   ```

3. **Update Upload Middleware** (`backend/src/middleware/upload.middleware.ts`)
   - Use multer-s3 for direct S3 uploads
   - Generate presigned URLs for downloads

4. **Update Worker**
   - Download file from S3 before processing
   - Upload result back to S3
   - Use streaming to minimize memory usage

### Option 3: Combine Backend + Worker (Quick Fix)

Run worker in the same container as backend.

#### Steps:

1. **Update backend's package.json**

   ```json
   {
     "scripts": {
       "start": "node dist/index.js & node dist/worker.js",
       "build": "tsc && cd ../worker && npm run build && cp -r dist ../backend/dist/worker"
     }
   }
   ```

2. **Merge worker dependencies into backend**

   ```bash
   cd backend
   npm install bullmq ioredis fluent-ffmpeg @ffmpeg-installer/ffmpeg @ffprobe-installer/ffprobe
   ```

3. **Copy worker code to backend**

   ```bash
   cp -r worker/src backend/src/worker
   ```

4. **Start both processes** in Railway backend:
   - Update start command to run both
   - Or use a process manager like PM2

## Recommended: Option 2 (S3 Storage)

### Why S3?

- ✅ Scalable - no disk space limits
- ✅ Reliable - built-in redundancy
- ✅ Cost-effective - pay for what you use
- ✅ Works with multiple workers
- ✅ No need for cleanup jobs (set lifecycle rules)
- ✅ Direct downloads - offload bandwidth from your servers

### Cloudflare R2 Pricing (Cheapest)

- Storage: $0.015/GB/month
- Operations: Free egress (no bandwidth charges!)
- API calls: 1M writes $4.50, 10M reads $0.36

### Quick Implementation

Create `backend/src/utils/storage.ts`:

```typescript
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  filePath: string,
  key: string
): Promise<string> {
  const fileStream = fs.createReadStream(filePath);
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: fileStream,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return key;
}

export async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function downloadFromS3(
  key: string,
  destPath: string
): Promise<void> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });

  const response = await s3Client.send(command);
  const stream = response.Body as any;

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(destPath);
    stream.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}
```

## Current Workaround (Temporary)

Until you implement S3, you can merge backend and worker:

```bash
cd backend
npm install bullmq ioredis fluent-ffmpeg @ffmpeg-installer/ffmpeg @ffprobe-installer/ffprobe
```

Update `backend/src/index.ts`:

```typescript
// At the end of the file
import { startWorker } from "../worker/src/index";

if (process.env.NODE_ENV === "production") {
  startWorker(); // Run worker in same process
}
```

This way both backend and worker share the same filesystem.
