import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.middleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/:fileId", authenticate, async (req, res, next) => {
  try {
    const metadata = await prisma.fileMetadata.findFirst({
      where: { fileId: req.params.fileId },
      include: {
        file: {
          include: {
            outputJobs: {
              where: { status: "completed" },
              take: 1,
            },
          },
        },
      },
    });

    if (!metadata) {
      throw new AppError(404, "Metadata not found");
    }

    // Check access
    const job = metadata.file.outputJobs[0];
    if (job && job.userId !== req.user!.userId) {
      throw new AppError(403, "Access denied");
    }

    res.json({
      title: metadata.title,
      artist: metadata.artist,
      album: metadata.album,
      duration: metadata.duration?.toString(),
      bitrate: metadata.bitrate,
      sampleRate: metadata.sampleRate,
      channels: metadata.channels,
      codec: metadata.codec,
      resolution: metadata.resolution,
      frameRate: metadata.frameRate?.toString(),
      thumbnailPath: metadata.thumbnailPath,
      rawMetadata: metadata.rawMetadata,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
