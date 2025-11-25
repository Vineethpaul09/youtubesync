const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const jobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        inputFile: true,
        outputFile: true,
      },
    });

    console.log(
      JSON.stringify(
        jobs,
        (key, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      )
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
