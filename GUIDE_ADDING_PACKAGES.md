# Guide: Adding New Packages

This template is designed so shared logic lives in `packages/*` and is consumed by apps through `workspace:*` dependencies.

## 1) Create the package folder

Create a new package under `packages/<your-package-name>`.

Required files:

- `package.json`
- `tsconfig.json`
- `eslint.config.mjs`
- `src/index.ts`

Use existing packages like `packages/validation` or `packages/auth` as reference.

## 2) Configure `package.json`

Use this shape:

```json
{
  "name": "@repo/your-package",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  }
}
```

If you need subpath exports, add them explicitly:

```json
"exports": {
  ".": "./src/index.ts",
  "./server": "./src/server.ts"
}
```

## 3) Configure TypeScript and ESLint

For TypeScript:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "include": ["src/**/*"]
}
```

For ESLint:

```js
import { config } from "@repo/eslint-config/base";
export default config;
```

## 4) Add dependencies only where needed

Install from workspace root:

```bash
pnpm --filter @repo/your-package add <dependency>
pnpm --filter @repo/your-package add -D <dev-dependency>
```

Avoid putting package-specific dependencies in the root `package.json`.

## 5) Consume package from an app/package

In consumer `package.json`:

```json
"dependencies": {
  "@repo/your-package": "workspace:*"
}
```

Then import:

```ts
import { something } from "@repo/your-package";
```

## 6) Validate workspace

Run:

```bash
pnpm lint
pnpm check-types
```

If your package is DB-related, also run package-specific commands (for Prisma: `pnpm db:generate`).
