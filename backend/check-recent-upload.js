const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    console.log("=== Most Recent Upload Attempt ===");
    const recentFile = await prisma.file.findFirst({
      where: {
        originalFilename: {
          contains: "అర్పణసమయంసమర్పణఘడియా",
        },
      },
      orderBy: { uploadedAt: "desc" },
      include: {
        inputJobs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (recentFile) {
      console.log(
        JSON.stringify(
          recentFile,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          2
        )
      );
    } else {
      console.log("No file found with that name");

      // Check last 3 uploads
      console.log("\n=== Last 3 File Uploads ===");
      const lastFiles = await prisma.file.findMany({
        take: 3,
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
          lastFiles,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          2
        )
      );
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
