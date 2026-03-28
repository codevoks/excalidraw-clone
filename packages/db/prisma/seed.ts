/**
 * Prisma entrypoint — `pnpm db:seed` from repo root, or `pnpm prisma:seed` in this package.
 * Implement logic in `src/seed/index.ts` (`runSeed`).
 */
import { runSeed } from "../src/seed/index";
import { db as prisma } from "../src/client";

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
