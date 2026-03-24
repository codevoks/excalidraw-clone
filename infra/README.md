# Infra (placeholders)

Yahan se Docker, CI/CD, monitoring aur IaC extend karo — repo root par clutter kam rahe isliye sab `infra/` ke neeche group kiya hai.

| Path | Purpose |
|------|---------|
| [`docker/`](./docker/) | `docker-compose` (local DB), production-style `Dockerfile` |
| [`monitoring/`](./monitoring/) | APM / errors / logs / traces — env keys + wiring notes |
| [`terraform/`](./terraform/) | Cloud resources (VPC, DB, secrets) — empty starter |
| [`k8s/`](./k8s/) | Kubernetes manifests placeholder |
| [`ci/`](./ci/) | CI/CD notes (actual workflows: `.github/workflows/`) |

GitHub Actions: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — install, Prisma generate, lint, types, web build.
