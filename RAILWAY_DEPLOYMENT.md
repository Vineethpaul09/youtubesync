# Railway Deployment Guide - Token Authentication Fix

## Issues Fixed

1. **CORS Configuration** - Now properly allows Railway domains
2. **JWT_SECRET Validation** - No longer falls back to insecure default
3. **Token Persistence** - Request interceptor automatically adds token from localStorage
4. **Better Error Handling** - Prevents redirect loops on login/register pages

## Backend Environment Variables (Railway)

Set these in your Railway backend service:

```
DATABASE_URL=<your-railway-postgres-url>
JWT_SECRET=<generate-strong-random-string-min-32-chars>
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.railway.app
```

### How to Generate JWT_SECRET

Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Frontend Environment Variables (Railway)

Set these in your Railway frontend service:

```
VITE_API_URL=https://your-backend.railway.app
```

## Deployment Steps

### 1. Deploy Backend First

1. Push your code to GitHub
2. Create a new Railway project
3. Add PostgreSQL database
4. Deploy backend service from GitHub
5. Set environment variables above
6. Copy the backend URL (e.g., `https://youtubesync-backend.railway.app`)

### 2. Deploy Frontend

1. Add frontend service to Railway project
2. Set `VITE_API_URL` to your backend URL
3. Deploy frontend service
4. Copy the frontend URL

### 3. Update Backend FRONTEND_URL

1. Go to backend service in Railway
2. Update `FRONTEND_URL` with your frontend URL
3. Redeploy backend

## Testing Authentication

1. Open your Railway frontend URL
2. Register a new account
3. Login with credentials
4. Navigate to dashboard
5. Refresh the page - you should stay logged in
6. Token should persist across page refreshes

## Troubleshooting

### "Invalid token" or "No token provided"

**Check:**

- JWT_SECRET is set in backend Railway environment
- VITE_API_URL is correct in frontend
- FRONTEND_URL is set correctly in backend
- Both services are deployed and running

### "CORS error"

**Check:**

- FRONTEND_URL matches your actual frontend domain
- Backend CORS is allowing Railway domains (\*.railway.app)
- Both services use HTTPS in production

### Token not persisting after refresh

**Check:**

- Browser localStorage is enabled
- No browser extensions blocking localStorage
- auth-storage key exists in localStorage (check DevTools → Application → Local Storage)

### Still having issues?

1. Check Railway logs for both services
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Ensure database migrations ran successfully

## Local Development

For local development, use:

**Backend `.env`:**

```
DATABASE_URL="postgresql://localhost:5432/youtubesync"
JWT_SECRET="dev-secret-min-32-characters-long"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

**Frontend `.env`:**

```
VITE_API_URL="http://localhost:3000"
```

## Security Notes

- Never commit `.env` files
- Use strong, random JWT_SECRET (minimum 32 characters)
- JWT tokens expire after 24 hours
- Tokens are stored in localStorage (consider httpOnly cookies for production)
