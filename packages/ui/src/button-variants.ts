import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold leading-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_14px_32px_-16px_rgba(91,124,250,0.85)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_18px_36px_-14px_rgba(91,124,250,0.95)]",
        secondary:
          "border border-[var(--color-secondary)] bg-[var(--color-secondary)] text-slate-950 shadow-[0_14px_32px_-16px_rgba(31,182,166,0.85)] hover:-translate-y-0.5 hover:bg-[var(--color-secondary-hover)] hover:shadow-[0_18px_36px_-14px_rgba(31,182,166,0.95)]",
        tertiary:
          "border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface),white_3%)] text-[var(--color-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-2)]",
        ghost:
          "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-2)]",
        destructive: "bg-red-600 text-white hover:bg-red-500",
      },
      size: {
        default: "h-11 px-7",
        sm: "h-10 px-6 text-sm",
        lg: "h-12 px-12 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);
