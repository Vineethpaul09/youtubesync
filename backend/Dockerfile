FROM node:20-slim

# Install system dependencies: Python, FFmpeg, yt-dlp, and required libraries
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    wget \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

# Run migrations and start production server
# Use || true for migrate to continue even if no migrations needed
CMD ["sh", "-c", "npx prisma migrate deploy || echo 'Migration completed or skipped' && node dist/start.js"]
