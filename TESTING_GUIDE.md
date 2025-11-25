# Testing Guide - Media Processing Application

## Prerequisites

Ensure all services are running:

- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ Backend API (port 3000)
- ✅ Worker Process
- ✅ Frontend (port 5173)

## Test Scenarios

### 1. User Registration & Authentication

#### Test Registration

1. Open http://localhost:5173/register
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Confirm password: `password123`
5. Click "Register"

**Expected Result:** Redirect to dashboard with success message

#### Test Login

1. Open http://localhost:5173/login
2. Enter registered credentials
3. Click "Sign in"

**Expected Result:** Redirect to dashboard

### 2. File Upload & Conversion

#### Test Audio Conversion (MP3)

1. Navigate to "Upload Files" from dashboard
2. Click or drag-drop an audio file (e.g., .wav, .m4a)
3. Select output format: **MP3**
4. Select quality: **Medium**
5. Click "Upload and Convert"

**Expected Result:**

- Success toast notification
- Redirect to Jobs page
- Job shows as "pending" or "processing"

#### Test Video Conversion (MP4)

1. Upload a video file (e.g., .avi, .mov)
2. Select output format: **MP4**
3. Select quality: **High**
4. Upload

**Expected Result:**

- Job appears in jobs list
- Progress bar shows conversion progress (0-100%)

### 3. Job Monitoring

#### Check Job Status

1. Navigate to "View Jobs"
2. Observe job status updates (refreshes every 5 seconds)
3. Watch progress bar for processing jobs

**Job Status Flow:**

- `pending` → Yellow badge, clock icon
- `processing` → Blue badge, spinning loader, progress bar
- `completed` → Green badge, checkmark, download button
- `failed` → Red badge, X icon, error message

#### Test Auto-Refresh

1. Leave jobs page open
2. Watch for automatic updates every 5 seconds
3. Click "Refresh" button for manual update

### 4. File Download

#### Download Converted File

1. Wait for job to complete (status: "completed")
2. Click "Download" button on completed job
3. Check downloads folder

**Expected Result:**

- Browser download starts
- File is playable in media player
- Filename includes "\_converted" suffix

### 5. Bulk Operations

#### Multiple File Upload

1. Upload 3-5 files at once (drag & drop multiple)
2. Set same output format for all
3. Click "Upload and Convert X Files"

**Expected Result:**

- All files appear in jobs list
- Each job processes independently
- Multiple jobs can process concurrently (worker concurrency: 2)

### 6. Error Handling

#### Test Invalid File Type

1. Try uploading a non-media file (e.g., .txt, .pdf)
2. Observe error message

**Expected Result:** Error toast or validation message

#### Test Large File

1. Upload a very large file (>5GB if limit is 5GB)
2. Check for size validation

**Expected Result:** Error message about file size limit

## Backend API Testing (Optional)

### Using Postman/cURL

#### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Expected Response:**

```json
{
  "user": { "id": "...", "email": "test@example.com" },
  "token": "eyJhbGc..."
}
```

#### Upload File (requires auth token)

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.mp3" \
  -F "outputFormat=wav" \
  -F "qualityPreset=high"
```

#### Get Jobs

```bash
curl http://localhost:3000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Validation Checklist

- [ ] User can register successfully
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong credentials
- [ ] Dashboard shows user email
- [ ] Upload page accepts valid media files
- [ ] Upload page rejects invalid file types
- [ ] Jobs appear in jobs list after upload
- [ ] Job status updates from pending → processing → completed
- [ ] Progress bar shows accurate progress
- [ ] Completed jobs have download button
- [ ] Download button downloads correct file
- [ ] Downloaded file is playable
- [ ] Multiple files can be uploaded together
- [ ] Auto-refresh updates job status every 5 seconds
- [ ] Failed jobs show error messages
- [ ] Logout works correctly

## Performance Testing

### Concurrent Processing

1. Upload 5 files simultaneously
2. Observe that 2 jobs process at once (worker concurrency)
3. Others wait in queue

### Quality Presets

Test each quality preset:

- **Low:** Faster processing, smaller file size
- **Medium:** Balanced
- **High:** Slower, larger file size
- **Ultra:** Slowest, largest file size

Compare:

- Processing time
- Output file size
- Audio/video quality

## Troubleshooting

### Services Not Running

```powershell
# Check Docker containers
docker ps

# Start backend
cd backend
npm run dev

# Start worker
cd worker
npm run dev

# Start frontend
cd frontend
npm run dev
```

### Worker Not Processing

1. Check Redis connection in worker logs
2. Verify FFmpeg installation
3. Check worker logs for errors
4. Verify job queue has items: Check Redis CLI

### Files Not Downloading

1. Check backend logs for download endpoint errors
2. Verify file exists in storage path
3. Check browser console for errors

## Sample Files for Testing

Recommended test files:

- **Small audio:** < 5MB MP3 or WAV
- **Medium video:** 10-50MB MP4 or MOV
- **Large video:** 100MB+ MKV or AVI

Convert between formats:

- Audio: MP3 ↔ WAV ↔ AAC ↔ FLAC
- Video: MP4 ↔ WebM ↔ MKV

## Success Criteria

✅ All services start without errors
✅ User can complete full workflow: register → upload → convert → download
✅ Jobs process successfully with correct output format
✅ UI updates in real-time
✅ Files are downloadable and playable
✅ Error handling works for edge cases
