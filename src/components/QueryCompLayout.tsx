"use client";

import React from "react";
import type { QueryObserverResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { extract_message } from "@/helpers/apihelpers";
import type { ApiResponse } from "@/types";
import { Loader2, AlertCircle, RefreshCcw, ShieldOff } from "lucide-react";

export interface QueryCompState<TData = unknown> {
  data?: TData;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  refetch?: () => void | Promise<unknown>;
}

export type QueryCompQueryType<TData> =
  | QueryCompState<TData>
  | QueryObserverResult<TData, unknown>;

interface QueryCompLayoutProps<TData> {
  query: QueryCompQueryType<TData>;
  children?: React.ReactNode | ((data: NonNullable<TData>) => React.ReactNode);
  loadingText?: string;
  customLoading?: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

export default function QueryCompLayout<TData>(
  props: QueryCompLayoutProps<TData>,
) {
  const {
    children,
    customLoading,
    query,
    loadingText = "Loading...",
    emptyState,
    className = "",
  } = props;

  if (query.isLoading) {
    if (customLoading) {
      return <>{customLoading}</>;
    }
    return (
      <div
        className={`w-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 ${className}`}
      >
        <div className="relative flex items-center justify-center mb-4">
          {/* Animated Rings */}
          <div className="absolute h-16 w-16 rounded-full border-3 border-primary/15 border-t-primary animate-spin duration-[2000ms]" />
          <div className="absolute h-12 w-12 rounded-full border-3 border-primary/10 border-b-primary/40 animate-spin duration-[3000ms] [animation-direction:reverse]" />

          {/* Center Icon */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-inner">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        </div>

        {/* Text Content */}
        <p className="text-sm font-medium tracking-tight text-text/70">
          {loadingText}
        </p>
      </div>
    );
  }

  if (query.isError) {
    const axiosErr = query.error as AxiosError<ApiResponse> | undefined;
    const status =
      axiosErr?.response?.status ??
      (query.error as { status?: number; code?: number } | undefined)?.status ??
      (query.error as { status?: number; code?: number } | undefined)?.code;

    const is403 = status === 403;

    if (is403) {
      return (
        <div
          className={`w-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300 ${className}`}
        >
          <div className="mb-3 rounded-full bg-error/10 p-3 text-error">
            <ShieldOff className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-text">Access Denied</h4>
          <p className="mt-1 text-xs text-text/60 max-w-xs">
            You don't have permission to view this resource.
          </p>
        </div>
      );
    }

    const errorMsg = extract_message(query.error);

    return (
      <div
        className={`w-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300 ${className}`}
      >
        <div className="mb-3 rounded-full bg-error/10 p-2.5 text-error">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h4 className="text-base font-bold text-text">
          Failed to load content
        </h4>
        <p className="mt-1 text-xs text-text/60 max-w-xs">
          {errorMsg || "An unexpected error occurred."}
        </p>
        {query.refetch && (
          <button
            type="button"
            onClick={() => query.refetch?.()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (query.data == null) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <div className={`animate-in fade-in duration-500 ${className}`}>
      {typeof children === "function"
        ? children(query.data as NonNullable<TData>)
        : children}
    </div>
  );
}
