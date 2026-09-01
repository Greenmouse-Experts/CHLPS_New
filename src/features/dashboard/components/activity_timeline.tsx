"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Notification01Icon,
  ShoppingBag01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/shared/Cards";
import { ActivityItem, ActivityType } from "../domain/data/response/dashboard_response";

const typeMeta: Record<string, { icon: typeof Wallet01Icon; tone: string }> = {
  payment: { icon: Wallet01Icon, tone: "bg-[#E8F8F1] text-[#166534]" },
  assessment: { icon: File01Icon, tone: "bg-lilac text-primary" },
  order_confirmed: { icon: CheckmarkCircle02Icon, tone: "bg-[#E8F8F1] text-[#166534]" },
  order_created: { icon: ShoppingBag01Icon, tone: "bg-cream text-secondary" },
  certificate: { icon: Award01Icon, tone: "bg-[#FEFAE0] text-[#854D0E]" },
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ActivityTimeline({
  items,
  loading,
}: {
  items: ActivityItem[];
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border border-sand bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-primary">Activity timeline</h2>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-14 rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No recent activity yet."
          description="Your purchases, assessments, and certificates will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const meta = typeMeta[item.type as ActivityType] ?? {
              icon: Notification01Icon,
              tone: "bg-lilac text-primary",
            };
            return (
              <li
                key={`${item.timestamp}-${index}`}
                className="flex items-start gap-3 rounded-lg border border-sand px-3 py-3"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.tone}`}
                >
                  <HugeiconsIcon icon={meta.icon} size={16} color="currentColor" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text">{item.title}</p>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-text/60">{item.description}</p>
                  )}
                  <p className="mt-1 text-xs uppercase tracking-wide text-text/45">
                    {formatTime(item.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
