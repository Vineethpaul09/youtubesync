const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    console.log("=== Last 5 Uploads ===");
    const recentUploads = await prisma.file.findMany({
      where: {
        status: "uploaded",
      },
      take: 5,
      orderBy: { uploadedAt: "desc" },
      include: {
        inputJobs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    console.log(
      JSON.stringify(
        recentUploads,
        (key, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      )
    );

    console.log("\n=== Upload Statistics ===");
    const totalUploads = await prisma.file.count({
      where: { status: "uploaded" },
    });
    const totalCompleted = await prisma.file.count({
      where: { status: "completed" },
    });

    console.log(`Total Uploaded Files: ${totalUploads}`);
    console.log(`Total Completed Files: ${totalCompleted}`);

    console.log("\n=== Recent Failed Jobs ===");
    const failedJobs = await prisma.job.findMany({
      where: { status: "failed" },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { inputFile: true },
    });

    if (failedJobs.length > 0) {
      console.log(
        JSON.stringify(
          failedJobs,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          2
        )
      );
    } else {
      console.log("No failed jobs");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
