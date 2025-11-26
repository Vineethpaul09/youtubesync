import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

// Set FFmpeg paths
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const prisma = new PrismaClient();

interface JobData {
  jobId: string;
  inputFilePath: string;
  outputFormat: string;
  qualityPreset?: string;
  options?: Record<string, any>;
}

const qualitySettings: Record<string, any> = {
  audio: {
    low: { bitrate: "128k" },
    medium: { bitrate: "192k" },
    high: { bitrate: "256k" },
    ultra: { bitrate: "320k" },
  },
  video: {
    low: { videoBitrate: "500k", size: "640x360" },
    medium: { videoBitrate: "1000k", size: "1280x720" },
    high: { videoBitrate: "2500k", size: "1920x1080" },
    ultra: { videoBitrate: "5000k", size: "2560x1440" },
  },
};

export async function processJob(data: JobData): Promise<void> {
  const { jobId, inputFilePath, outputFormat, qualityPreset = "medium" } = data;

  logger.info(`Starting job ${jobId}`);
  logger.info(`Input path received: ${inputFilePath}`);
  logger.info(`Output format: ${outputFormat}, Quality: ${qualityPreset}`);

  try {
    // Update job status to processing
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "processing",
        startedAt: new Date(),
        workerId: process.env.HOSTNAME || "worker-1",
      },
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { inputFile: true },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // Ensure paths are absolute and handle both old relative paths and new absolute paths
    let absoluteInputPath: string;

    if (path.isAbsolute(inputFilePath)) {
      // New format: already absolute path
      absoluteInputPath = inputFilePath;
    } else {
      // Old format: relative path - try multiple locations
      const storageDir = process.env.STORAGE_PATH
        ? path.resolve(process.env.STORAGE_PATH)
        : path.resolve(process.cwd(), "./uploads");

      // First try: resolve from configured storage directory
      const pathFromStorage = path.join(
        storageDir,
        path.basename(inputFilePath)
      );

      // Second try: resolve from worker's current directory
      const pathFromWorkerCwd = path.resolve(process.cwd(), inputFilePath);

      // Third try: resolve from parent directory (backend location)
      const pathFromBackend = path.resolve(
        process.cwd(),
        "..",
        "backend",
        inputFilePath
      );

      if (fs.existsSync(pathFromStorage)) {
        absoluteInputPath = pathFromStorage;
      } else if (fs.existsSync(pathFromWorkerCwd)) {
        absoluteInputPath = pathFromWorkerCwd;
      } else if (fs.existsSync(pathFromBackend)) {
        absoluteInputPath = pathFromBackend;
      } else {
        absoluteInputPath = pathFromStorage; // Will fail later with clear error
      }
    }

    // Check if input file exists
    if (!fs.existsSync(absoluteInputPath)) {
      logger.error(`Input file not found. Tried path: ${absoluteInputPath}`);
      logger.error(`Original input path: ${inputFilePath}`);
      logger.error(`Is absolute: ${path.isAbsolute(inputFilePath)}`);
      logger.error(`Worker CWD: ${process.cwd()}`);
      logger.error(`STORAGE_PATH env: ${process.env.STORAGE_PATH}`);
      throw new Error(`Input file not found: ${absoluteInputPath}`);
    }

    logger.info(`Input file found at: ${absoluteInputPath}`);

    const outputDir = process.env.STORAGE_PATH
      ? path.resolve(process.env.STORAGE_PATH)
      : path.resolve(process.cwd(), "./uploads");

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFilename = `${path.parse(job.inputFile.originalFilename).name}_converted.${outputFormat}`;
    const outputPath = path.join(outputDir, outputFilename);

    const isAudio = ["mp3", "wav", "aac", "flac", "ogg"].includes(outputFormat);
    const isVideo = ["mp4", "webm", "mkv"].includes(outputFormat);

    logger.info(`Processing: ${absoluteInputPath} -> ${outputPath}`);

    await new Promise<void>((resolve, reject) => {
      const command = ffmpeg(absoluteInputPath);

      // Set output format
      command.format(outputFormat);

      if (isAudio) {
        const audioSettings = qualitySettings.audio[qualityPreset];
        command.audioBitrate(audioSettings.bitrate).noVideo();
      } else if (isVideo) {
        const videoSettings = qualitySettings.video[qualityPreset];
        command
          .videoBitrate(videoSettings.videoBitrate)
          .size(videoSettings.size);

        // Set appropriate codecs based on output format
        if (outputFormat === "webm") {
          command.videoCodec("libvpx").audioCodec("libvorbis");
        } else if (outputFormat === "mkv") {
          command.videoCodec("libx264").audioCodec("aac");
        } else {
          // mp4 and others
          command.videoCodec("libx264").audioCodec("aac");
        }
      }

      command
        .on("start", (commandLine) => {
          logger.info(`FFmpeg command: ${commandLine}`);
        })
        .on("progress", async (progress) => {
          const percent = Math.round(progress.percent || 0);
          await prisma.job.update({
            where: { id: jobId },
            data: { progress: percent },
          });
          logger.info(`Job ${jobId} progress: ${percent}%`);
        })
        .on("end", () => {
          logger.info(`FFmpeg finished processing job ${jobId}`);
          resolve();
        })
        .on("error", (err) => {
          logger.error(`FFmpeg error for job ${jobId}:`, err);
          reject(err);
        })
        .save(outputPath);
    });

    // Create output file record
    const outputFileSize = fs.statSync(outputPath).size;
    const outputFile = await prisma.file.create({
      data: {
        userId: job.userId,
        originalFilename: outputFilename,
        fileSize: BigInt(outputFileSize),
        mimeType: isAudio ? `audio/${outputFormat}` : `video/${outputFormat}`,
        storagePath: outputPath,
        status: "completed",
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
      },
    });

    // Extract metadata
    await extractMetadata(outputPath, outputFile.id);

    // Update job status to completed
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "completed",
        progress: 100,
        outputFileId: outputFile.id,
        completedAt: new Date(),
      },
    });

    logger.info(`Job ${jobId} completed successfully`);
  } catch (error: any) {
    logger.error(`Job ${jobId} failed:`, error);

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "failed",
        errorMessage: error.message,
      },
    });

    throw error;
  }
}

async function extractMetadata(
  filePath: string,
  fileId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, async (err, metadata) => {
      if (err) {
        logger.error("Failed to extract metadata:", err);
        resolve(); // Don't fail the job if metadata extraction fails
        return;
      }

      try {
        const audioStream = metadata.streams.find(
          (s) => s.codec_type === "audio"
        );
        const videoStream = metadata.streams.find(
          (s) => s.codec_type === "video"
        );

        await prisma.fileMetadata.create({
          data: {
            fileId,
            duration: metadata.format.duration,
            bitrate: metadata.format.bit_rate
              ? parseInt(String(metadata.format.bit_rate))
              : null,
            codec: videoStream?.codec_name || audioStream?.codec_name || null,
            sampleRate: audioStream?.sample_rate
              ? parseInt(String(audioStream.sample_rate))
              : null,
            channels: audioStream?.channels || null,
            resolution: videoStream
              ? `${videoStream.width}x${videoStream.height}`
              : null,
            frameRate: videoStream?.r_frame_rate
              ? parseFloat(videoStream.r_frame_rate)
              : null,
            rawMetadata: metadata as any,
          },
        });

        resolve();
      } catch (error) {
        logger.error("Failed to save metadata:", error);
        resolve();
      }
    });
  });
}
