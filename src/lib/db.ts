import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Singleton instance Prisma Client untuk Next.js App Router (Prisma 7 + pg adapter).
 * Mencegah instansiasi berulang (connection pool leak) saat Hot Module Replacement (HMR) di mode development.
 * Sesuai panduan ADR-002 dan BACKEND_JOBDESK.md.
 */
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://creatify_user:secretpass@localhost:5432/creatify_db?schema=public";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const pool = globalForPrisma.pgPool ?? new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.pgPool = pool;
}

export default db;
