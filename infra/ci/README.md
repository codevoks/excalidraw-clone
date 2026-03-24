# CI / CD

- **Continuous integration**: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — `pnpm` install, `db:generate`, `lint`, `check-types`, `turbo build --filter=web`.
- **Deploy**: yahan apna pipeline add karo (Vercel / Fly / Railway / ECS / Kubernetes). Template mein deploy step intentionally blank hai taaki team apni choice use kare.

Suggested next steps: branch protection on `main`, required status checks, secrets for `DATABASE_URL` / `JWT_SECRET` in deploy environments.
