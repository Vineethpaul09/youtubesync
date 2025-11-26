import Queue from "bull";
import { logger } from "./utils/logger";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || "2");

export function startWorker() {
  try {
    logger.info("Initializing worker...");
    logger.info(`Redis URL: ${REDIS_URL}`);
    logger.info(`Concurrency: ${CONCURRENCY}`);

    // Import worker processor
    const { processJob } = require("./processors/media.processor");
    logger.info("Media processor loaded successfully");

    const jobQueue = new Queue("media-processing", REDIS_URL);
    logger.info("Job queue created");

    jobQueue.process(CONCURRENCY, async (job) => {
      logger.info(`Processing job ${job.id}: ${job.data.jobId}`);

      try {
        await processJob(job.data);
        logger.info(`Job ${job.id} completed successfully`);
      } catch (error) {
        logger.error(`Job ${job.id} failed:`, error);
        throw error;
      }
    });

    jobQueue.on("completed", (job) => {
      logger.info(`Job ${job.id} completed`);
    });

    jobQueue.on("failed", (job, err) => {
      logger.error(`Job ${job?.id} failed with error: ${err.message}`);
    });

    jobQueue.on("error", (error) => {
      logger.error("Queue error:", error);
    });

    jobQueue.on("ready", () => {
      logger.info("Worker is ready to process jobs");
    });

    logger.info(`✓ Worker started with concurrency: ${CONCURRENCY}`);
    logger.info(`✓ Connected to Redis: ${REDIS_URL}`);

    process.on("SIGTERM", async () => {
      logger.info("SIGTERM signal received, closing worker");
      await jobQueue.close();
    });
  } catch (error) {
    logger.error("Failed to start worker:", error);
    throw error;
  }
}
