import { PrismaClient } from "@prisma/client";

// Prevents creating a new client on every hot-reload during dev.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
