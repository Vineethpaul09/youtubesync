const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    console.log("=== Failed Jobs ===");
    const failedJobs = await prisma.job.findMany({
      where: { status: "failed" },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { inputFile: true },
    });
    console.log(
      JSON.stringify(
        failedJobs,
        (key, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      )
    );

    console.log("\n=== Pending/Processing Jobs ===");
    const pendingJobs = await prisma.job.findMany({
      where: {
        status: {
          in: ["pending", "processing"],
        },
      },
      orderBy: { createdAt: "desc" },
      include: { inputFile: true },
    });
    console.log(
      JSON.stringify(
        pendingJobs,
        (key, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      )
    );

    console.log("\n=== Job Status Summary ===");
    const statusCounts = await prisma.job.groupBy({
      by: ["status"],
      _count: true,
    });
    console.log(JSON.stringify(statusCounts, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
