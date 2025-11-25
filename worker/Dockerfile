FROM node:20-alpine

# Install system dependencies: Python, FFmpeg, yt-dlp, and OpenSSL 1.1 for Prisma
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    yt-dlp \
    openssl1.1-compat

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

# Start production worker
CMD ["node", "dist/index.js"]
