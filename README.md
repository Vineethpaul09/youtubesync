# 🎬 Media Processor

A scalable, secure, privacy-focused bulk media processing framework for converting audio and video files.

## 🌟 Features

- ✅ Bulk file upload with drag & drop
- ✅ Audio transcoding (MP3, WAV, AAC, FLAC, OGG)
- ✅ Video transcoding (MP4, WebM, MKV)
- ✅ Quality selection (bitrate, resolution)
- ✅ Metadata extraction and editing
- ✅ Real-time progress tracking
- ✅ Job queue with retry logic
- ✅ Batch operations with ZIP download
- ✅ Clean, ad-free UI
- ✅ Privacy-first (no tracking, auto-delete files)

## 🏗️ Architecture

```
Frontend (React) → API (Express) → Queue (Redis) → Workers (FFmpeg) → Storage
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd media-processor
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start infrastructure**

```bash
npm run docker:up
```

5. **Run database migrations**

```bash
npm run db:migrate
```

6. **Start development servers**

```bash
npm run dev
```

7. **Access the application**

- Frontend: http://localhost:5173
- API: http://localhost:3000
- API Docs: http://localhost:3000/api-docs

## 📁 Project Structure

```
media-processor/
├── backend/          # Express.js API server
├── frontend/         # React + Vite frontend
├── worker/           # FFmpeg processing workers
├── shared/           # Shared types and utilities
├── docker-compose.yml
├── turbo.json
└── package.json
```

## 🛠️ Tech Stack

### Backend

- Node.js + TypeScript
- Express.js
- PostgreSQL (Prisma ORM)
- Redis (Bull Queue)
- Socket.io
- JWT Authentication

### Frontend

- React 18 + TypeScript
- Vite
- Tailwind CSS + Shadcn UI
- Zustand (State Management)
- Socket.io-client
- React Dropzone

### Worker

- Node.js + TypeScript
- FFmpeg
- Bull Queue Consumer

## 📝 Available Scripts

```bash
npm run dev          # Start all services in development
npm run build        # Build all packages
npm run test         # Run all tests
npm run lint         # Lint all packages
npm run format       # Format code with Prettier
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

## 🔒 Security

- File upload validation and sanitization
- JWT authentication
- Rate limiting
- CORS configuration
- Input validation
- Automatic file expiration
- Container isolation

## 📊 Monitoring

- Health check endpoints
- Prometheus metrics (coming soon)
- Grafana dashboards (coming soon)
- Structured logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- FFmpeg for media processing
- Bull for job queue management
- React and Vite communities

## 📚 Documentation

- [Project Specification](./PROJECT_SPEC.md)
- [API Documentation](./docs/API.md) (coming soon)
- [Architecture](./docs/ARCHITECTURE.md) (coming soon)
- [Deployment Guide](./docs/DEPLOYMENT.md) (coming soon)

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Check what's using the port
netstat -ano | findstr :3000
# Kill the process or change the port in .env
```

**Database connection failed:**

```bash
# Ensure PostgreSQL is running
docker-compose ps
# Check DATABASE_URL in .env
```

**FFmpeg not found:**

```bash
# Install FFmpeg
# Windows: choco install ffmpeg
# Mac: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg
```

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check the [documentation](./PROJECT_SPEC.md)

---

Built with ❤️ for learning and education
