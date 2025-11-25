FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

EXPOSE 5173

# Serve production build with Vite preview
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]
