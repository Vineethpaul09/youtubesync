import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting frontend server...");
console.log("Current directory:", __dirname);
console.log("PORT environment variable:", process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// Check if dist directory exists
const distPath = path.join(__dirname, "dist");
console.log("Checking dist directory:", distPath);
if (fs.existsSync(distPath)) {
  console.log("✓ dist directory exists");
  const files = fs.readdirSync(distPath);
  console.log("Files in dist:", files);
} else {
  console.error("✗ dist directory NOT found!");
}

// Serve static files from dist directory
app.use(express.static(distPath));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle client-side routing - serve index.html for all routes
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  console.log("Serving index.html from:", indexPath);
  res.sendFile(indexPath);
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal Server Error");
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Frontend server successfully started`);
  console.log(`✓ Listening on 0.0.0.0:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
