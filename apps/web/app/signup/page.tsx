import { AuthForm } from "../../components/auth/auth-form";

export default function SignUpPage() {
  return (
    <section className="space-y-6">
      <div className="mx-auto w-full max-w-md px-1">
        <p className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
          Authentication
        </p>
      </div>
      <AuthForm mode="signup" />
    </section>
  );
}
