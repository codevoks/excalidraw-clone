import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-8 sm:space-y-10">
      <div className="card-shell space-y-6 px-6 py-10 sm:px-10 sm:py-12">
        <div className="space-y-5">
          <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
            Build fast. Ship better.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            Turborepo starter with auth routes, Prisma user model, Zod validation and
            middleware protection. Focus on product logic, not setup repetition.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/signup" className="btn-base btn-primary min-w-52">
              Start with Sign up
            </Link>
            <Link href="/signin" className="btn-base btn-tertiary min-w-52">
              Already have account
            </Link>
            <Link href="/dashboard" className="btn-base btn-secondary min-w-52">
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card-shell space-y-3">
          <h3 className="text-xl font-semibold">Auth APIs included</h3>
          <p className="text-sm text-foreground-muted">
              Sign in, sign up, sign out and me endpoints are production-ready.
          </p>
          <p className="text-sm leading-relaxed text-foreground-muted">
            Cookie JWT flow with secure defaults and clean route handlers.
          </p>
        </div>

        <div className="card-shell space-y-3">
          <h3 className="text-xl font-semibold">Protected dashboard</h3>
          <p className="text-sm text-foreground-muted">
              Middleware gate keeps private routes and auto-redirects guests.
          </p>
          <p className="text-sm leading-relaxed text-foreground-muted">
            Strong starting point for role-based routes and app-level authorization.
          </p>
        </div>

        <div className="card-shell space-y-3">
          <h3 className="text-xl font-semibold">Monorepo by default</h3>
          <p className="text-sm text-foreground-muted">
              Shared packages for auth, db, validation and ui with clean boundaries.
          </p>
          <p className="text-sm leading-relaxed text-foreground-muted">
            Add new apps or packages without copy-paste chaos.
          </p>
        </div>
      </div>
    </section>
  );
}
