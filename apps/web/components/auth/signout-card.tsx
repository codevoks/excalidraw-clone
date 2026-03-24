"use client";

import { useState } from "react";
import { Button } from "../ui/Button";

export function SignOutCard() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="card-shell mx-auto w-full max-w-md">
      <div className="space-y-2 px-2 pb-3 pt-2">
        <h2 className="font-serif text-2xl">Sign out</h2>
      </div>
      <div className="space-y-4 px-2 pb-2 pt-2">
        <p className="text-sm text-foreground-muted">
          This will clear your auth cookie and return you to home.
        </p>
        {error ? <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
        <Button
          variant="tertiary"
          className="h-12 w-full"
          busyLabel="Signing out…"
          api={{ method: "post", path: "/auth/signout", data: {} }}
          navigateTo="/home"
          refreshAfterNavigate
          onRequestStart={() => setError(null)}
          onError={() => setError("Could not sign out. Try again.")}
        >
          Confirm sign out
        </Button>
      </div>
    </div>
  );
}
