"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { TickDouble02Icon } from "@hugeicons/core-free-icons";
import { DashboardLayout, EmptyState, Pagination } from "@/components";
import { cn } from "@/lib/tokens";
import { useNotifications } from "../domain/data/hooks/notifications_hooks";

const NotificationsPage = () => {
  const {
    tab,
    setTab,
    page,
    setPage,
    isLoading,
    items,
    count,
    marking,
    markAll,
    markOne,
  } = useNotifications();

  return (
    <DashboardLayout title="Notifications">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Inbox</h2>
          <button
            type="button"
            onClick={markAll}
            disabled={marking}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            <HugeiconsIcon icon={TickDouble02Icon} size={16} color="currentColor" />
            Mark all as read
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-lg border border-sand bg-cream p-1">
          {(["unread", "read"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cn(
                "rounded-md py-2.5 text-sm font-medium capitalize",
                tab === item ? "bg-primary text-white" : "text-text/60 hover:text-text",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-sand bg-white">
            <EmptyState title="No notification yet" />
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => markOne(item.id, item.read)}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left",
                      item.read
                        ? "border-sand bg-white"
                        : "border-secondary/30 bg-secondary/5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-primary">{item.title}</p>
                        <p className="mt-1 leading-relaxed text-text/60">{item.body}</p>
                      </div>
                      {!item.read && (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                      )}
                    </div>
                    <p className="mt-3 text-xs text-text/40">
                      {new Date(item.createdDate).toLocaleString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
            <Pagination page={page} count={count} onPageChange={setPage} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
