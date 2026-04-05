"use client";

import axios from "axios";
import { useState } from "react";
import { postRequest } from "../../apiService";

type AuthMode = "signin" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = mode === "signin" ? "Sign in" : "Create account";
  const description =
    mode === "signin"
      ? "Welcome back. Enter your credentials to continue."
      : "Use your email and password to create an account.";

  const path = mode === "signin" ? "/v1/login" : "/v1/signup";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await postRequest({ path, data: { email, password } });
      window.location.assign("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object") {
        const body = err.response.data as { message?: string };
        setError(body.message ?? "Request failed. Please try again.");
      } else {
        setError("Unable to reach the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-shell mx-auto w-full max-w-md">
      <div className="space-y-2 px-2 pb-3 pt-2">
        <h2 className="font-serif text-2xl">{title}</h2>
        <p className="text-foreground-muted">
          {description}
        </p>
      </div>
      <div className="px-2 pb-2 pt-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              className="input-shell"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              className="input-shell"
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error ? <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}

          <button type="submit" className="btn-base btn-primary h-12 w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : title}
          </button>
        </form>
      </div>
    </div>
  );
}
