import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import jobRoutes from "./routes/job.routes";
import downloadRoutes from "./routes/download.routes";
import metadataRoutes from "./routes/metadata.routes";
import { errorHandler } from "./middleware/error.middleware";
import { logger } from "./utils/logger";
import { initializeWebSocket } from "./websocket";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.VITE_API_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/metadata", metadataRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Multer error handling middleware
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof require("multer").MulterError) {
      logger.error("Multer error:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File too large. Maximum size is 5GB." });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ error: "Unexpected field in upload." });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    return next(err);
  }
);

// Error handling
app.use(errorHandler);

// Initialize WebSocket
initializeWebSocket(io);

const PORT = process.env.API_PORT || 3000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

export { io };
