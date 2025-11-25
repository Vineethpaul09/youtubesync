const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    console.log("=== Recent Failed Jobs ===");
    const failedJobs = await prisma.job.findMany({
      where: { status: "failed" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        inputFile: true,
        outputFile: true,
      },
    });

    failedJobs.forEach((job) => {
      console.log("\n---");
      console.log("Job ID:", job.id);
      console.log("File:", job.inputFile.originalFilename);
      console.log("Error:", job.errorMessage);
      console.log("Input Path:", job.inputFile.storagePath);
      console.log("Created:", job.createdAt);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
