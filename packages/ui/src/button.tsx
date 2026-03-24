"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "./cn";
import { buttonVariants } from "./button-variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  appName?: string;
}

export function Button({
  className,
  variant,
  size,
  appName,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={onClick ?? (appName ? () => alert(`Hello from ${appName}!`) : undefined)}
      {...props}
    />
  );
}
