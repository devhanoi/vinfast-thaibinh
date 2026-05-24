import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function hasDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.trim().length === 0) return false;
  if (url.includes("noop") || url.includes("placeholder")) return false;
  return true;
}

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "postgresql://noop:noop@localhost:5432/noop";
  const adapter = new PrismaNeon({ connectionString: url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
