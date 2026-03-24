/**
 * Prisma entrypoint — `pnpm db:seed` from repo root, or `pnpm prisma:seed` in this package.
 * Implement logic in `src/seed/index.ts` (`runSeed`).
 */
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../src/seed/index";

const prisma = new PrismaClient();

async function main() {
  await runSeed(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
