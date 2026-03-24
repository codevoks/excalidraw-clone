import type { PrismaClient } from "@prisma/client";

/**
 * Dev / staging fixtures — split into `fixtures/` modules if this grows.
 */
export async function runSeed(prisma: PrismaClient): Promise<void> {
  // Cheap no-op so the client is used; replace with real inserts when ready.
  await prisma.$queryRaw`SELECT 1`;
  // await prisma.user.create({ data: { ... } })
}
