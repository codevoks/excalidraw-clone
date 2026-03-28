import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Next only auto-loads `.env*` from `apps/web`; shared secrets live at repo root.
dotenv.config({ path: path.join(__dirname, "../../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/auth", "@repo/db", "@repo/validation"],
  /** Used by `infra/docker/Dockerfile` (Next standalone output). Safe on Vercel too. */
  output: "standalone",
  /** Trace files from monorepo root so standalone output is not nested under random paths. */
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
