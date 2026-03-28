# Guide: Upgrading This Template

Use this process when you want to keep the starter modern without breaking active project repos created from it.

## 1) Upgrade in the template repo only

Do version bumps in this template repository first.

```bash
pnpm up -r
```

Then run:

```bash
pnpm install
pnpm lint
pnpm check-types
pnpm build
```

## 2) Verify critical flows

Always test:

- Sign up
- Sign in
- `/api/v1/me`
- Sign out
- Dashboard route protection (`/dashboard`)

## 3) Prisma upgrade workflow

If Prisma changes:

```bash
pnpm db:generate
pnpm db:push
```

Validate DB client imports in `@repo/db` consumers still typecheck.

## 4) Next.js / React major upgrades

When upgrading major versions:

- Review framework migration notes.
- Check middleware/auth cookie behavior.
- Check route handler behavior and edge/runtime compatibility.

Do not combine many major upgrades in one PR.

## 5) How existing projects consume template improvements

Projects created from template are independent repos. They do not auto-inherit updates.

Use one of these:

- Cherry-pick specific commits from template.
- Manually copy selected improvements.
- Keep a `template-sync` branch in each project and merge selectively.

Avoid blind full-directory overwrites for mature projects.

## 6) Suggested release cadence

- Monthly patch/minor dependency updates.
- Quarterly review for major upgrades.
- Security updates immediately.

Track template versions with git tags (for example: `template-v1.0.0`, `template-v1.1.0`).
