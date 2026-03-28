import { Button } from "../../components/ui";
import { getSessionUser } from "../../lib/auth";

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <section className="space-y-5">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl tracking-tight">
        Dashboard
      </h1>
      <p className="text-[var(--color-foreground-muted)]">
        Protected route is active. You can now build project-specific business
        logic here.
      </p>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-foreground)] flex items-center justify-between">
        <span>
          Logged in as:{" "}
          <span className="font-medium text-[var(--color-secondary)]">
            {user?.email}
          </span>
        </span>
        <Button variant="primary" navigateTo="draw">
          Draw
        </Button>
      </div>
    </section>
  );
}
