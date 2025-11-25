FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install serve globally for production serving
RUN npm install -g serve

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

EXPOSE 3000

# Serve production build with serve package
CMD ["serve", "-s", "dist", "-l", "3000"]
