# 🚀 Getting Started Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

## Step 1: Clone and Setup

```powershell
# Navigate to the project directory
cd c:\Vineeth\Projects\youtubesync

# Copy environment variables
Copy-Item .env.example .env

# Install dependencies (root)
npm install
```

## Step 2: Start Infrastructure

Start PostgreSQL and Redis using Docker:

```powershell
# Start databases
npm run docker:up

# Wait for containers to be healthy (about 30 seconds)
docker ps
```

You should see:
- `media-processor-db` (PostgreSQL)
- `media-processor-redis` (Redis)

## Step 3: Setup Database

```powershell
# Navigate to backend
cd backend

# Install backend dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Go back to root
cd ..
```

## Step 4: Install Frontend & Worker Dependencies

```powershell
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install worker dependencies
cd worker
npm install
cd ..
```

## Step 5: Start Development Servers

Open **3 separate PowerShell terminals**:

### Terminal 1 - Backend API
```powershell
cd backend
npm run dev
```
You should see: `Server running on port 3000`

### Terminal 2 - Worker
```powershell
cd worker
npm run dev
```
You should see: `Worker started with concurrency: 2`

### Terminal 3 - Frontend
```powershell
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173/`

## Step 6: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/health

## 🧪 Test the Application

1. Open http://localhost:5173
2. Click "Register" to create an account
3. Login with your credentials
4. You'll see the dashboard (placeholder pages for now)

## 📊 Check Database

To view your database:

```powershell
cd backend
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555

## 🛑 Stop Everything

```powershell
# Stop Docker containers
npm run docker:down

# Or stop everything including removing volumes
docker-compose down -v
```

## 🔧 Troubleshooting

### Port Already in Use

**Problem:** Port 3000, 5173, 5432, or 6379 is already in use.

**Solution:**
```powershell
# Find what's using the port (e.g., 3000)
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Get-Process -Id $_ }

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

Or change the port in `.env`:
```
API_PORT=3001
```

### Database Connection Failed

**Problem:** Cannot connect to PostgreSQL

**Solution:**
```powershell
# Check if PostgreSQL container is running
docker ps

# Check container logs
docker logs media-processor-db

# Restart containers
npm run docker:down
npm run docker:up
```

### Prisma Client Not Generated

**Problem:** `@prisma/client` module not found

**Solution:**
```powershell
cd backend
npm run db:generate
```

### FFmpeg Not Found (Worker)

**Problem:** Worker can't find FFmpeg

**Solution:**

**Windows:**
```powershell
# Install using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
# Add to PATH
```

**Using Docker (recommended):**
```powershell
# Use Docker Compose to run worker
docker-compose up worker
```

### React Dependencies Missing

**Problem:** Cannot find module 'react' or similar

**Solution:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## 📝 Next Steps

Now that your environment is set up, you can:

1. **Implement file upload** - Add multer configuration and file validation
2. **Build FFmpeg processor** - Complete the media conversion logic
3. **Create UI components** - Build the upload interface and job dashboard
4. **Add WebSocket updates** - Implement real-time progress tracking
5. **Deploy to cloud** - Set up production environment

## 🎯 Development Workflow

```powershell
# Start everything
npm run dev

# Run linting
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## 📚 Useful Commands

```powershell
# View all running Docker containers
docker ps

# View Docker logs
docker logs -f media-processor-backend
docker logs -f media-processor-worker

# Access PostgreSQL CLI
docker exec -it media-processor-db psql -U postgres -d media_processor

# Access Redis CLI
docker exec -it media-processor-redis redis-cli

# Reset database (CAREFUL - deletes all data)
cd backend
npx prisma migrate reset
```

## 🔐 Default Credentials

After running the application, create your first user via the Register page.

**Database Access (Development):**
- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: media_processor

**Redis (Development):**
- Host: localhost
- Port: 6379

## ✅ Verify Everything Works

Run this checklist:

- [ ] Docker containers running (`docker ps`)
- [ ] Backend API responding (http://localhost:3000/health)
- [ ] Frontend loads (http://localhost:5173)
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Database has user record (Prisma Studio)
- [ ] No errors in terminal logs

---

**🎉 You're all set! Start building your media processing framework!**

For more details, see [PROJECT_SPEC.md](./PROJECT_SPEC.md)
