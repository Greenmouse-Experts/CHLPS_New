import React from "react";
import { cn } from "@/lib/tokens";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

function StatCard({ title, value, icon, className, loading }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-sand bg-white p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-text/55">
            {title}
          </p>
          {loading ? (
            <div className="skeleton mt-2 h-8 w-24 rounded" />
          ) : (
            <p className="mt-1.5 text-3xl font-bold leading-none tracking-tight text-primary">
              {value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lilac text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-text/60">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export { StatCard, EmptyState };
export type { StatCardProps, EmptyStateProps };
