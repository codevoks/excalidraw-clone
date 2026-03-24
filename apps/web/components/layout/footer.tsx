import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-14 border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <p className="font-serif text-xl text-foreground">
            Turbo Auth Template
          </p>
          <p className="text-sm leading-relaxed text-foreground-muted">
            A dark, modern starter crafted for fast product launches without rewriting
            auth and platform foundations.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-foreground">Navigation</p>
          <Link className="block text-foreground-muted hover:text-primary" href="/home">
            Home
          </Link>
          <Link className="block text-foreground-muted hover:text-primary" href="/signin">
            Sign in
          </Link>
          <Link className="block text-foreground-muted hover:text-primary" href="/signup">
            Sign up
          </Link>
          <Link className="block text-foreground-muted hover:text-primary" href="/dashboard">
            Dashboard
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-foreground">Stack</p>
          <p className="text-foreground-muted">Next.js + Turborepo</p>
          <p className="text-foreground-muted">Prisma + PostgreSQL</p>
          <p className="text-foreground-muted">Zod + JWT + bcrypt</p>
          <p className="text-foreground-muted">Axios (same-origin API)</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-foreground">Socials</p>
          <a className="block text-foreground-muted hover:text-primary" href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="block text-foreground-muted hover:text-primary" href="https://x.com" target="_blank" rel="noreferrer">
            X
          </a>
          <a className="block text-foreground-muted hover:text-primary" href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-foreground-muted sm:px-6 lg:px-8">
          <p>Built for serious builders.</p>
          <p>{new Date().getFullYear()} Turbo Template</p>
        </div>
      </div>
    </footer>
  );
}
