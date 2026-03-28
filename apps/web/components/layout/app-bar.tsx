"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRequest } from "../../apiService";

type SessionState = {
  isAuthenticated: boolean;
  loading: boolean;
};

export function AppBar() {
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    const loadSession = async () => {
      try {
        await getRequest({ path: "/v1/me", data: {} });
        if (!mounted) return;
        setSession({ isAuthenticated: true, loading: false });
      } catch {
        if (!mounted) return;
        setSession({ isAuthenticated: false, loading: false });
      }
    };

    loadSession();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/home" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-foreground" />
          Turbo Auth Template
        </Link>

        {!session.loading && (
          <div className="flex items-center gap-2">
            <Link href="/home" className="btn-base btn-tertiary">
              Home
            </Link>

            {session.isAuthenticated ? (
              <>
                <Link href="/dashboard" className="btn-base btn-secondary">
                  Dashboard
                </Link>
                <Link href="/signout" className="btn-base btn-tertiary">
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link href="/signin" className="btn-base btn-tertiary">
                  Sign in
                </Link>
                <Link href="/signup" className="btn-base btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
