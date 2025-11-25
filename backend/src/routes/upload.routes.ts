import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AppError } from "../middleware/error.middleware";
import { addJobToQueue } from "../queue/job.queue";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import youtubedl from "youtube-dl-exec";

const router = Router();
const prisma = new PrismaClient();

const uploadSchema = z.object({
  outputFormat: z.enum([
    "mp3",
    "mp4",
    "wav",
    "aac",
    "webm",
    "mkv",
    "flac",
    "ogg",
  ]),
  qualityPreset: z.enum(["low", "medium", "high", "ultra"]).optional(),
  options: z.record(z.any()).optional(),
});

router.post(
  "/",
  authenticate,
  upload.single("file"),
  async (req, res, next) => {
    try {
      console.log("Upload request received");
      console.log("File:", req.file?.originalname);
      console.log("Body:", req.body);

      if (!req.file) {
        console.error("No file in request");
        throw new AppError(400, "No file uploaded");
      }

      console.log("File uploaded to:", req.file.path);
      console.log("File size:", req.file.size);
      console.log("File mimetype:", req.file.mimetype);

      const { outputFormat, qualityPreset, options } = uploadSchema.parse(
        req.body
      );

      console.log(
        "Parsed params - format:",
        outputFormat,
        "quality:",
        qualityPreset
      );

      // Calculate checksum
      const fileBuffer = fs.readFileSync(req.file.path);
      const checksum = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      console.log("Checksum calculated:", checksum);

      // Calculate expiration (48 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      // Ensure we store absolute path
      const absolutePath = path.isAbsolute(req.file.path)
        ? req.file.path
        : path.resolve(req.file.path);

      // Save file record
      const file = await prisma.file.create({
        data: {
          userId: req.user!.userId,
          originalFilename: req.file.originalname,
          fileSize: BigInt(req.file.size),
          mimeType: req.file.mimetype,
          storagePath: absolutePath,
          checksum,
          expiresAt,
          status: "uploaded",
        },
      });

      // Create job
      const job = await prisma.job.create({
        data: {
          userId: req.user!.userId,
          inputFileId: file.id,
          jobType: "transcode",
          inputFormat: req.file.mimetype.split("/")[1],
          outputFormat,
          qualityPreset: qualityPreset || "medium",
          options: options || {},
          status: "pending",
        },
      });

      // Add to queue
      await addJobToQueue({
        jobId: job.id,
        inputFilePath: absolutePath,
        outputFormat,
        qualityPreset,
        options,
      });

      console.log("Job added to queue:", job.id);

      res.status(201).json({
        file: {
          id: file.id,
          originalFilename: file.originalFilename,
          fileSize: file.fileSize.toString(),
          mimeType: file.mimeType,
        },
        job: {
          id: job.id,
          status: job.status,
          outputFormat: job.outputFormat,
          qualityPreset: job.qualityPreset,
        },
      });

      console.log("Upload successful:", file.originalFilename);
    } catch (error) {
      console.error("Upload error:", error);
      // Clean up file if something went wrong
      if (req.file && fs.existsSync(req.file.path)) {
        console.log("Cleaning up file:", req.file.path);
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  }
);

// Upload from YouTube URL
const urlUploadSchema = z.object({
  url: z.string().url(),
  outputFormat: z.enum([
    "mp3",
    "mp4",
    "wav",
    "aac",
    "webm",
    "mkv",
    "flac",
    "ogg",
  ]),
  qualityPreset: z.enum(["low", "medium", "high", "ultra"]).optional(),
});

router.post("/url", authenticate, async (req, res, next) => {
  let downloadedFilePath: string | null = null;

  try {
    console.log("YouTube URL upload request:", req.body);

    const { url, outputFormat, qualityPreset } = urlUploadSchema.parse(
      req.body
    );

    console.log("Starting YouTube download for:", url);

    // Setup storage
    const uploadDir = process.env.STORAGE_PATH
      ? path.resolve(process.env.STORAGE_PATH)
      : path.resolve(process.cwd(), "./uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // First, get video info to extract title
    console.log("Fetching video info for:", url);
    let videoTitle = `youtube_${Date.now()}`;

    try {
      const videoInfo = await youtubedl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        skipDownload: true,
      });

      // Sanitize title for filename
      if (
        typeof videoInfo === "object" &&
        videoInfo !== null &&
        "title" in videoInfo &&
        videoInfo.title
      ) {
        videoTitle = String(videoInfo.title)
          .replace(/[<>:"/\\|?*]/g, "") // Remove invalid filename characters
          .replace(/\s+/g, "_") // Replace spaces with underscores
          .substring(0, 100); // Limit length
        console.log("Video title:", videoInfo.title);
        console.log("Sanitized filename:", videoTitle);
      }
    } catch (error: any) {
      console.warn(
        "Could not fetch video info, using timestamp:",
        error.message
      );
    }

    const fileName = `${videoTitle}.mp4`;
    downloadedFilePath = path.join(uploadDir, fileName);

    // Download video with youtube-dl-exec
    console.log("Downloading video to:", downloadedFilePath);

    try {
      await youtubedl(url, {
        output: downloadedFilePath,
        format: "best[ext=mp4]/best",
        noWarnings: true,
        noCheckCertificates: true,
        preferFreeFormats: false,
        youtubeSkipDashManifest: true,
        referer: url,
      });

      console.log("Video download completed successfully");
    } catch (error: any) {
      console.error("Download error:", error.message);
      throw new AppError(500, `Download failed: ${error.message}`);
    }

    console.log("Download complete:", downloadedFilePath);

    // Calculate checksum
    const fileBuffer = fs.readFileSync(downloadedFilePath);
    const checksum = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");
    const fileSize = fs.statSync(downloadedFilePath).size;

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Save file record
    const file = await prisma.file.create({
      data: {
        userId: req.user!.userId,
        originalFilename: `${videoTitle}.mp4`,
        fileSize: BigInt(fileSize),
        mimeType: "video/mp4",
        storagePath: downloadedFilePath,
        checksum,
        expiresAt,
        status: "uploaded",
      },
    });

    // Create job
    const job = await prisma.job.create({
      data: {
        userId: req.user!.userId,
        inputFileId: file.id,
        jobType: "transcode",
        inputFormat: "mp4",
        outputFormat,
        qualityPreset: qualityPreset || "medium",
        options: {},
        status: "pending",
      },
    });

    // Add to queue
    await addJobToQueue({
      jobId: job.id,
      inputFilePath: downloadedFilePath,
      outputFormat,
      qualityPreset: qualityPreset || "medium",
      options: {},
    });

    console.log("YouTube upload successful:", videoTitle);

    res.status(201).json({
      file: {
        id: file.id,
        originalFilename: file.originalFilename,
        fileSize: file.fileSize.toString(),
        mimeType: file.mimeType,
      },
      job: {
        id: job.id,
        status: job.status,
        outputFormat: job.outputFormat,
        qualityPreset: job.qualityPreset,
      },
    });
  } catch (error) {
    console.error("YouTube upload error:", error);
    // Clean up downloaded file if something went wrong
    if (downloadedFilePath && fs.existsSync(downloadedFilePath)) {
      console.log("Cleaning up file:", downloadedFilePath);
      fs.unlinkSync(downloadedFilePath);
    }
    next(error);
  }
});

// Get supported formats
router.get("/formats", (_req, res) => {
  res.json({
    audio: ["mp3", "wav", "aac", "flac", "ogg"],
    video: ["mp4", "webm", "mkv"],
    quality: ["low", "medium", "high", "ultra"],
  });
});

export default router;
