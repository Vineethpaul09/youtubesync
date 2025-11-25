FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Install http-server globally for serving static files
RUN npm install -g http-server

EXPOSE 3000

# Serve dist folder with http-server
CMD ["http-server", "dist", "-p", "3000", "-a", "0.0.0.0", "--proxy", "http://0.0.0.0:3000?"]
