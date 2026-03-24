/* eslint-disable react/prop-types */
import * as React from "react";
import { cn } from "./cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-foreground)] ring-offset-[var(--color-background)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-foreground-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        type={type}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
