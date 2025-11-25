FROM node:20-alpine

# Install system dependencies: Python, FFmpeg, and yt-dlp
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    yt-dlp

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 3000

# Run migrations and start production server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
