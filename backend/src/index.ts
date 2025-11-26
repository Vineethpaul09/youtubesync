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

// Configure allowed origins
const allowedOrigins: string[] = [
  process.env.FRONTEND_URL,
  process.env.VITE_API_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter((origin): origin is string => Boolean(origin));

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.includes(".railway.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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

const PORT = process.env.PORT || process.env.API_PORT || 3000;

// Wrap server startup in try-catch
try {
  httpServer.listen(Number(PORT), "0.0.0.0", () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Server listening on 0.0.0.0:${PORT}`);
  });
} catch (error) {
  logger.error("Failed to start server:", error);
  process.exit(1);
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

export { io };
