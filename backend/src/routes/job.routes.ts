import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";
import { addJobToQueue } from "../queue/job.queue";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.user!.userId },
      include: {
        inputFile: true,
        outputFile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert BigInt to string for JSON serialization
    const serializedJobs = jobs.map((job: any) => ({
      ...job,
      inputFile: job.inputFile
        ? {
            ...job.inputFile,
            fileSize: job.inputFile.fileSize.toString(),
          }
        : null,
      outputFile: job.outputFile
        ? {
            ...job.outputFile,
            fileSize: job.outputFile.fileSize.toString(),
          }
        : null,
    }));

    res.json(serializedJobs);
  } catch (error) {
    next(error);
  }
});

router.get("/:jobId", authenticate, async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.jobId },
      include: {
        inputFile: true,
        outputFile: true,
        logs: {
          orderBy: { timestamp: "desc" },
          take: 50,
        },
      },
    });

    if (!job || job.userId !== req.user!.userId) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Convert BigInt to string
    const serializedJob = {
      ...job,
      inputFile: job.inputFile
        ? {
            ...job.inputFile,
            fileSize: job.inputFile.fileSize.toString(),
          }
        : null,
      outputFile: job.outputFile
        ? {
            ...job.outputFile,
            fileSize: job.outputFile.fileSize.toString(),
          }
        : null,
    };

    return res.json(serializedJob);
  } catch (error) {
    return next(error);
  }
});

// Retry a failed job
router.post("/:jobId/retry", authenticate, async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.jobId },
      include: {
        inputFile: true,
      },
    });

    if (!job || job.userId !== req.user!.userId) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (job.status !== "failed") {
      res.status(400).json({ error: "Only failed jobs can be retried" });
      return;
    }

    // Reset job status
    const updatedJob = await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "pending",
        progress: 0,
        errorMessage: null,
        startedAt: null,
        completedAt: null,
        retryCount: job.retryCount + 1,
      },
    });

    // Re-add to queue
    await addJobToQueue({
      jobId: job.id,
      inputFilePath: job.inputFile.storagePath,
      outputFormat: job.outputFormat,
      qualityPreset: job.qualityPreset || undefined,
      options: job.options as Record<string, any>,
    });

    console.log(`Job ${job.id} retried (attempt ${job.retryCount + 1})`);

    res.json({
      message: "Job queued for retry",
      job: {
        id: updatedJob.id,
        status: updatedJob.status,
        retryCount: updatedJob.retryCount,
      },
    });
  } catch (error) {
    console.error("Retry error:", error);
    next(error);
  }
});

export default router;
