# Guide: Adding New Apps

You can add many app types to Turborepo. Turborepo does not force one runtime, it only orchestrates builds, dev servers, caching, and task pipelines.

## Recommended app types

Common production options:

- Next.js (`apps/web`)
- Express/Fastify/Nest (`apps/api`)
- React/Vite (`apps/client`)
- React Native / Expo (`apps/mobile`)
- Go (`apps/go-api`)
- Python (FastAPI/Django) (`apps/python-api`)
- Rust (Axum/Actix) (`apps/rust-api`)
- Java (Spring Boot) (`apps/java-api`)
- Solidity/Hardhat/Foundry (`apps/contracts`)

## 1) Create app directory and baseline files

Create under `apps/<app-name>`.

For example:

```bash
mkdir -p apps/api/src
```

Create these files:

- `apps/api/package.json`
- `apps/api/tsconfig.json` (for TS apps)
- `apps/api/src/index.ts`
- optional: `.env.example`, `README.md`

## 2) Add app `package.json` with Turborepo-friendly scripts

For Node-based apps, include scripts Turborepo can run:

```json
{
  "name": "api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  }
}
```

Why this works: Turborepo picks workspace scripts automatically. If script names match (`dev`, `build`, `lint`, `check-types`), no extra root config is required.

## 3) Add app `tsconfig.json` (TypeScript apps)

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 4) Wire shared packages

Use workspace dependencies:

```json
"dependencies": {
  "@repo/auth": "workspace:*",
  "@repo/validation": "workspace:*",
  "@repo/db": "workspace:*"
}
```

Then install app-specific dependencies from repo root, for example:

```bash
pnpm --filter api add express cors
pnpm --filter api add -D tsx @types/express @types/cors
```

## 5) Update `turbo.json` only when needed

Current root `turbo.json` already handles standard tasks (`dev`, `build`, `lint`, `check-types`) for all workspaces with matching script names.

If your app has special outputs, add them under the corresponding task.

Example for a compiled Node app output:

```json
"build": {
  "outputs": ["dist/**"]
}
```

## 6) Run and verify the new app

Run only your new app:

```bash
pnpm --filter api dev
```

Run all workspace checks:

```bash
pnpm lint
pnpm check-types
```

## 7) Add a TypeScript WebSocket app (full example)

This is useful for realtime features (live prices, notifications, multiplayer, chat, collaborative docs).

### Step A: Create app folder

```bash
mkdir -p apps/ws/src
```

### Step B: Create `apps/ws/package.json`

```json
{
  "name": "ws",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^22.15.3",
    "@types/ws": "^8.18.0",
    "eslint": "^9.39.1",
    "tsx": "^4.20.3",
    "typescript": "5.9.2"
  }
}
```

### Step C: Create `apps/ws/tsconfig.json`

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step D: Create `apps/ws/src/index.ts`

```ts
import { WebSocketServer } from "ws";

const port = Number(process.env.WS_PORT ?? 8080);
const wss = new WebSocketServer({ port });

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "connected", message: "Welcome to WS server" }));

  socket.on("message", (raw) => {
    const message = raw.toString();

    // Echo to sender
    socket.send(JSON.stringify({ type: "echo", message }));
  });
});

console.log(`WebSocket server running on ws://localhost:${port}`);
```

### Step E: Run WebSocket app

```bash
pnpm --filter ws dev
```

### Step F: Connect from web app

In `apps/web`, client-side example:

```ts
const ws = new WebSocket("ws://localhost:8080");
ws.onmessage = (event) => {
  console.log("WS message:", event.data);
};
```

If you deploy behind a reverse proxy, move to `wss://` and configure origin/security rules.

## 8) Non-Node apps (Go, Python, Rust, Java, Solidity)

You can still place them in `apps/*`. Turborepo can run any shell command through scripts. Typical pattern:

- Keep the language toolchain local to that app.
- Add app-level scripts that call the language tooling.
- Keep shared contracts/types in language-neutral formats (OpenAPI, protobuf, JSON schema) or generate language bindings from one source.

## 9) Example strategy by domain

- Web2 SaaS: Next app + API app + shared auth/db/validation packages.
- Web3 app: Next app + contracts app + indexer/worker app + shared validation.
- AI app: Next app + worker app + shared schema package for prompt I/O and response validation + optional websocket stream app.

This keeps reusable infra stable while each app owns its product-specific logic.
