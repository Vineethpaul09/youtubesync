import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.middleware";
import path from "path";
import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

router.get("/:fileId", authenticate, async (req, res, next) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: req.params.fileId },
      include: {
        outputJobs: {
          where: { status: "completed" },
          orderBy: { completedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!file) {
      throw new AppError(404, "File not found");
    }

    // Check if user owns this file or if it's an output file they have access to
    const job = file.outputJobs[0];
    if (job && job.userId !== req.user!.userId) {
      throw new AppError(403, "Access denied");
    }

    if (!fs.existsSync(file.storagePath)) {
      throw new AppError(404, "File no longer available");
    }

    const filename = file.originalFilename;
    res.download(file.storagePath, filename);
  } catch (error) {
    next(error);
  }
});

router.get("/preview/:fileId", authenticate, async (req, res, next) => {
  try {
    const metadata = await prisma.fileMetadata.findFirst({
      where: { fileId: req.params.fileId },
      include: { file: true },
    });

    if (!metadata || !metadata.thumbnailPath) {
      throw new AppError(404, "Thumbnail not found");
    }

    if (!fs.existsSync(metadata.thumbnailPath)) {
      throw new AppError(404, "Thumbnail file not available");
    }

    res.sendFile(path.resolve(metadata.thumbnailPath));
  } catch (error) {
    next(error);
  }
});

export default router;
