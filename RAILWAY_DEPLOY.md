# Railway.app Deployment Guide

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (no credit card required)
3. You'll get $5 free credit per month

## Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select repository: `Vineethpaul09/youtubesync`
5. Branch: `master`

## Step 3: Add Database & Redis

### Add PostgreSQL:

1. In your project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create the database
4. Copy the `DATABASE_URL` connection string

### Add Redis:

1. Click "+ New" again
2. Select "Database" → "Add Redis"
3. Railway will automatically create Redis
4. Copy the `REDIS_URL` connection string

## Step 4: Deploy Backend

1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Configure:
   - **Service Name**: `backend`
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && node dist/index.js`

4. Add Environment Variables:

   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   JWT_SECRET=[generate random 32+ char string]
   STORAGE_PATH=/app/uploads
   ```

5. Click "Deploy"

## Step 5: Deploy Worker

1. Click "+ New" → "GitHub Repo"
2. Select same repository
3. Configure:
   - **Service Name**: `worker`
   - **Root Directory**: `/worker`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`

4. Add Environment Variables:

   ```
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   STORAGE_PATH=/app/uploads
   WORKER_CONCURRENCY=2
   ```

5. Click "Deploy"

## Step 6: Deploy Frontend

1. Click "+ New" → "GitHub Repo"
2. Select same repository
3. Configure:
   - **Service Name**: `frontend`
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`

4. Add Environment Variables:

   ```
   VITE_API_URL=https://backend-production-xxxx.up.railway.app
   ```

   _(Replace with your actual backend URL from Step 4)_

5. Click "Deploy"

## Step 7: Generate Domain

For each service (Backend & Frontend):

1. Go to service settings
2. Click "Generate Domain"
3. Railway will create a public URL

Example:

- Backend: `https://backend-production-xxxx.up.railway.app`
- Frontend: `https://frontend-production-xxxx.up.railway.app`

## Step 8: Update Frontend Environment

1. Go to Frontend service
2. Update `VITE_API_URL` with your Backend URL
3. Redeploy frontend

## Alternative: One-Click Deploy

Instead of manual setup, use Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd C:\Vineeth\Projects\youtubesync
railway init

# Link to project
railway link

# Add PostgreSQL
railway add --database postgres

# Add Redis
railway add --database redis

# Deploy all services
railway up
```

## Environment Variables Reference

### Backend

| Variable     | Value                      |
| ------------ | -------------------------- |
| NODE_ENV     | production                 |
| PORT         | 3000                       |
| DATABASE_URL | ${{Postgres.DATABASE_URL}} |
| REDIS_URL    | ${{Redis.REDIS_URL}}       |
| JWT_SECRET   | [random string]            |
| STORAGE_PATH | /app/uploads               |

### Worker

| Variable           | Value                      |
| ------------------ | -------------------------- |
| NODE_ENV           | production                 |
| DATABASE_URL       | ${{Postgres.DATABASE_URL}} |
| REDIS_URL          | ${{Redis.REDIS_URL}}       |
| STORAGE_PATH       | /app/uploads               |
| WORKER_CONCURRENCY | 2                          |

### Frontend

| Variable     | Value              |
| ------------ | ------------------ |
| VITE_API_URL | [Your Backend URL] |

## Monitoring

- View logs: Click on service → "Logs" tab
- Monitor resources: "Metrics" tab
- Check health: Visit `https://your-backend-url.railway.app/health`

## Cost Management

- Free tier: $5/month credit
- Monitor usage in "Usage" tab
- Set budget alerts in project settings

## Troubleshooting

### Backend won't start

- Check DATABASE_URL is set correctly
- Verify Prisma migrations ran: Check logs for "prisma migrate deploy"
- Ensure JWT_SECRET is set

### Worker not processing

- Verify REDIS_URL is correct
- Check worker logs for connection errors
- Ensure STORAGE_PATH matches backend

### Frontend can't connect

- Verify VITE_API_URL points to backend domain
- Check CORS settings in backend
- Ensure backend is running

### Database connection errors

- Use internal DATABASE_URL (starts with postgresql://)
- Don't use external URL for services in same project

## Custom Domain (Optional)

1. Go to Frontend service settings
2. Click "Custom Domain"
3. Add your domain (e.g., youtubesync.com)
4. Update DNS records as instructed
5. Railway handles SSL automatically

## Support

- Railway Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app
