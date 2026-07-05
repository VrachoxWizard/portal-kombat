import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/combatportal";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({
    adapter,
    log: ['error'],
  });
} else {
  // Reuse the Pool in development to prevent connection leaks during Next.js hot-reloading
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ connectionString });
  }
  
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(globalForPrisma.pool);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ['error', 'warn'], // Mute query logs to keep server console clean, showing only warnings/errors
    });
  }
  
  prisma = globalForPrisma.prisma;
}

export { prisma };
export default prisma;
