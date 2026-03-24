# Docker

## Local database

Postgres for development (compose file root par reference):

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

Phir `.env` mein `DATABASE_URL` host ko `localhost` rakho (compose exposes `5432`).

## Production image

[`Dockerfile`](./Dockerfile) — `turbo prune web --docker`, Prisma generate, Next `standalone` output. Build **monorepo root** se:

```bash
docker build -f infra/docker/Dockerfile -t turborepo-web .
```

Runtime env: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`.

Adjust `CMD` / healthchecks / non-root user as your platform requires.
