import Queue from "bull";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const jobQueue = new Queue("media-processing", REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export async function addJobToQueue(jobData: {
  jobId: string;
  inputFilePath: string;
  outputFormat: string;
  qualityPreset?: string;
  options?: Record<string, any>;
}) {
  return await jobQueue.add(jobData, {
    priority: jobData.options?.priority || 5,
  });
}
