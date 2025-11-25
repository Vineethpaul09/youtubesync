FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and server script
COPY . .

# Build production bundle
RUN npm run build

EXPOSE 3000

# Start Express server directly with node (not npm)
CMD ["node", "server.js"]
