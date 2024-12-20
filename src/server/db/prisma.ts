import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ||
  new PrismaClient({
    // Optional: add log levels if you want more debugging
    // log: ['query', 'info', 'warn', 'error'],
  });

// Only create a new instance in non-production environments
if (process.env.NODE_ENV !== "production") {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  }
}
