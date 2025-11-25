# ⚡ Quick Reference

## 🚀 Start Everything

```powershell
# 1. Start Docker services
npm run docker:up

# 2. Open 3 terminals and run:
cd backend && npm run dev    # Terminal 1
cd worker && npm run dev     # Terminal 2
cd frontend && npm run dev   # Terminal 3
```

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | User interface |
| Backend API | http://localhost:3000 | REST API |
| Health Check | http://localhost:3000/health | API status |
| Prisma Studio | http://localhost:5555 | Database viewer |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Message queue |

## 📝 Common Commands

### Development
```powershell
npm run dev          # Start all services
npm run build        # Build all packages
npm run lint         # Lint code
npm run format       # Format code
```

### Database
```powershell
cd backend
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open database viewer
npm run db:seed      # Seed database
```

### Docker
```powershell
npm run docker:up    # Start containers
npm run docker:down  # Stop containers
docker ps            # List running containers
docker logs -f <container-name>  # View logs
```

## 🔑 Environment Variables

Key variables in `.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/media_processor

# Redis
REDIS_URL=redis://localhost:6379

# API
API_PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Storage
STORAGE_TYPE=local
STORAGE_PATH=./uploads
MAX_FILE_SIZE=5368709120
FILE_EXPIRATION_HOURS=48

# Frontend
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## 📂 Project Structure

```
youtubesync/
├── backend/          # API Server (Express + TypeScript)
├── frontend/         # UI (React + Vite)
├── worker/           # Processing (FFmpeg + Bull)
├── shared/           # Shared types (future)
├── .env              # Environment variables
├── docker-compose.yml
└── package.json
```

## 🛠️ Tech Stack

### Backend
- Express.js - Web framework
- Prisma - Database ORM
- PostgreSQL - Database
- Socket.io - WebSocket
- Bull - Job queue
- JWT - Authentication

### Frontend
- React 18 - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- Zustand - State management
- React Router - Navigation
- Axios - HTTP client

### Worker
- FFmpeg - Media processing
- Bull - Queue consumer
- Fluent-FFmpeg - FFmpeg wrapper

## 🐛 Quick Troubleshooting

### Port in use
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Get-Process -Id $_ }
# Kill it
Stop-Process -Id <PID> -Force
```

### Database issues
```powershell
cd backend
npm run db:generate  # Regenerate client
npx prisma migrate reset  # Reset (deletes data!)
```

### Dependencies issues
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Docker issues
```powershell
docker-compose down -v  # Stop and remove volumes
docker system prune -a  # Clean everything (careful!)
npm run docker:up
```

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register  # Create account
POST /api/auth/login     # Login
GET  /api/auth/me        # Get current user
```

### Upload (Coming Soon)
```
POST /api/upload/initiate   # Start upload
POST /api/upload/chunk      # Upload chunk
POST /api/upload/complete   # Finish upload
```

### Jobs
```
GET  /api/jobs              # List all jobs
GET  /api/jobs/:jobId       # Get job details
DELETE /api/jobs/:jobId     # Cancel job
POST /api/jobs/:jobId/retry # Retry failed job
```

### Download (Coming Soon)
```
GET /api/download/:fileId         # Download file
GET /api/download/batch/:batchId  # Download ZIP
```

## 🎯 Development Workflow

1. **Make changes** in `src/` directories
2. **See hot reload** (automatic restart)
3. **Check logs** in terminal
4. **Test** with browser/Postman
5. **Commit** when working

## 📦 Package Scripts

### Root
- `dev` - Start all services
- `build` - Build all packages
- `lint` - Lint all code
- `format` - Format all code
- `docker:up` - Start Docker
- `docker:down` - Stop Docker

### Backend
- `dev` - Start with hot reload
- `build` - Build TypeScript
- `start` - Run production build
- `db:migrate` - Run migrations
- `db:studio` - Open DB viewer

### Frontend
- `dev` - Start dev server
- `build` - Build for production
- `preview` - Preview production build

### Worker
- `dev` - Start with hot reload
- `build` - Build TypeScript
- `start` - Run production build

## 🔐 Default Credentials

### Database (Development)
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `media_processor`

### Redis (Development)
- Host: `localhost`
- Port: `6379`
- No password

## ✅ Health Checks

```powershell
# API
curl http://localhost:3000/health

# Database
docker exec -it media-processor-db pg_isready

# Redis
docker exec -it media-processor-redis redis-cli ping
```

## 📚 Documentation Files

- `README.md` - Project overview
- `PROJECT_SPEC.md` - Full specification
- `GETTING_STARTED.md` - Setup guide
- `SETUP_COMPLETE.md` - Status & next steps
- `QUICK_REFERENCE.md` - This file

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FFmpeg Guide](https://ffmpeg.org/documentation.html)
- [Bull Queue](https://docs.bullmq.io/)

## 💬 Need Help?

1. Check `GETTING_STARTED.md` troubleshooting
2. Review Docker logs
3. Check `.env` configuration
4. Verify all dependencies installed
5. Ensure ports are available

---

**Keep this file handy for quick lookups! 📌**
