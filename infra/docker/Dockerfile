# syntax=docker/dockerfile:1
# Build from repository root: docker build -f infra/docker/Dockerfile -t turborepo-web .

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo prune web --docker

FROM base AS installer
ARG DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/turborepo_template?schema=public
ARG JWT_SECRET=build-time-placeholder-min-32-characters-long
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET

COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .

RUN pnpm db:generate
RUN pnpm turbo run build --filter=web

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
