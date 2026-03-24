# Turborepo Auth Template

Production-ready Turborepo starter with `pnpm`, Next.js app router auth flows, Prisma, shared Zod validation, and reusable UI components.

## Stack

- Turborepo + pnpm workspaces
- Next.js (`apps/web`) + Tailwind CSS
- Axios client + `apiService` helpers (`apps/web/apiService`, cookie-aware `withCredentials`)
- Prisma (`packages/db`)
- Zod validation (`packages/validation`)
- JWT + bcrypt auth utils (`packages/auth`)

## Implemented auth flows

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/signout`
- `GET /api/auth/me`
- Cookie-based JWT session (`auth_token`)
- Middleware protection for `/dashboard`

## Local setup

1. Install dependencies:

```bash
pnpm install --no-frozen-lockfile
```

2. Add env variables:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
pnpm db:generate
```

4. Push schema to DB:

```bash
pnpm db:push
```

5. Run all apps:

```bash
pnpm dev
```

6. Open web app:

- [http://localhost:3000/home](http://localhost:3000/home)

## Repo structure

- `apps/web`: frontend, API routes, middleware, `instrumentation.ts` (observability hook)
- `packages/auth`: password hashing + JWT sign/verify
- `packages/db`: Prisma schema and DB client
- `packages/validation`: shared Zod schemas
- `packages/ui`: reusable Tailwind/shadcn-style components
- `infra/`: Docker, monitoring notes, Terraform/K8s placeholders — see [`infra/README.md`](infra/README.md)
- `.github/workflows`: CI (lint, types, build)

## Infra & ops (starters)

- **Docker**: [`infra/docker/Dockerfile`](infra/docker/Dockerfile) (Next standalone), [`infra/docker/docker-compose.yml`](infra/docker/docker-compose.yml) (local Postgres)
- **CI**: [`/.github/workflows/ci.yml`](.github/workflows/ci.yml)
- **Monitoring / IaC**: [`infra/monitoring`](infra/monitoring), [`infra/terraform`](infra/terraform), [`infra/k8s`](infra/k8s)

## Useful scripts

- `pnpm dev` - run all dev tasks
- `pnpm build` - build all apps/packages
- `pnpm lint` - lint all workspaces
- `pnpm check-types` - typecheck all workspaces
- `pnpm db:generate` - Prisma client generation
- `pnpm db:push` - sync schema to database
- `pnpm db:studio` - open Prisma Studio
- `pnpm db:seed` - run DB seed (`packages/db/src/seed`, entry `prisma/seed.ts`)

## Additional guides

- `GUIDE_ADDING_PACKAGES.md`
- `GUIDE_ADDING_APPS.md`
- `GUIDE_TEMPLATE_UPGRADES.md`
