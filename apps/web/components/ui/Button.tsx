"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useNavigate } from "../../hooks/useNavigate";
import api from "../../apiService/client";

const variantClass = {
  primary: "btn-base btn-primary",
  secondary: "btn-base btn-secondary",
  tertiary: "btn-base btn-tertiary",
} as const;

export type ButtonApiConfig = {
  method: "get" | "post" | "put" | "patch" | "delete";
  /** Path under `/api`, e.g. `/v1/logout` */
  path: string;
  data?: unknown;
  params?: Record<string, unknown>;
};

async function runApi(config: ButtonApiConfig) {
  const { method, path, data, params } = config;
  switch (method) {
    case "get":
      return api.get(path, { params: params ?? {} });
    case "post":
      return api.post(path, data);
    case "put":
      return api.put(path, data);
    case "patch":
      return api.patch(path, data);
    case "delete":
      return api.delete(path, { params: params ?? {} });
    default: {
      const _x: never = method;
      return _x;
    }
  }
}

export type ButtonProps = {
  children: ReactNode;
  variant?: keyof typeof variantClass;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  /** Shown while `api` or navigation is in flight. */
  busyLabel?: string;
  /** Next.js client navigation (same hook pattern as p2). Runs after successful `api` when both are set. */
  navigateTo?: string;
  /** Call `router.refresh()` after navigation (e.g. auth/session). */
  refreshAfterNavigate?: boolean;
  api?: ButtonApiConfig;
  /** Runs after `api` succeeds (if any), before `navigateTo`. */
  afterSuccess?: () => void | Promise<void>;
  /** Fires once when an async action starts (e.g. clear form errors). */
  onRequestStart?: () => void;
  onError?: (error: unknown) => void;
  /**
   * If set, only this runs — no automatic `api` / `navigateTo` handling.
   * Use for full manual control (or combine with your own hooks inside).
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  busyLabel = "Please wait…",
  navigateTo,
  refreshAfterNavigate = false,
  api: apiConfig,
  afterSuccess,
  onRequestStart,
  onError,
  onClick,
}: ButtonProps) {
  const navigate = useNavigate();
  const router = useRouter();
  const [internalLoading, setInternalLoading] = useState(false);

  const busy = internalLoading;
  const isDisabled = disabled || busy;

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      await onClick(event);
      return;
    }

    if (!apiConfig && !navigateTo) {
      return;
    }

    setInternalLoading(true);
    onRequestStart?.();
    try {
      if (apiConfig) {
        await runApi(apiConfig);
      }
      if (afterSuccess) {
        await afterSuccess();
      }
      if (navigateTo) {
        navigate(navigateTo);
        if (refreshAfterNavigate) {
          router.refresh();
        }
      }
    } catch (err) {
      onError?.(err);
      if (!onError && axios.isAxiosError(err)) {
        console.error(err.response?.data ?? err.message);
      } else if (!onError) {
        console.error(err);
      }
    } finally {
      setInternalLoading(false);
    }
  };

  const classes = [variantClass[variant], className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} disabled={isDisabled} onClick={handleClick}>
      {busy ? busyLabel : children}
    </button>
  );
}
