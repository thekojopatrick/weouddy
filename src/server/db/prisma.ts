import { Prisma, PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Optional: add log levels if you want more debugging
    // log: ['query', 'info', 'warn', 'error'],
    transactionOptions: {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  });

// Only create a new instance in non-production environments
if (process.env.NODE_ENV !== 'production') {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = db;
  }
}
