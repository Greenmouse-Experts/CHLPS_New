"use client";

import { DashboardLayout, EmptyState } from "@/components";
import { cn } from "@/lib/tokens";
import { usePurchaseHistory } from "../domain/data/hooks/purchase_history_hooks";

const PurchaseHistoryPage = () => {
  const { isLoading, orders } = usePurchaseHistory();

  return (
    <DashboardLayout title="Purchase History">
      <div className="overflow-hidden rounded-xl border border-sand bg-white">
        {isLoading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton h-12 rounded" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No purchases yet"
            description="Confirmed course and membership transactions will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-cream text-xs font-semibold tracking-wide text-text/55 uppercase">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Course(s)</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4 font-mono text-text/70">{order.number}</td>
                    <td className="max-w-xs px-5 py-4">
                      {order.orderItems?.map((item) => item.course.title).join(", ") || "—"}
                    </td>
                    <td className="px-5 py-4 font-medium text-primary">
                      ${Number(order.trx?.amount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 text-text/70">
                      {order.createdDate
                        ? new Date(order.createdDate).toLocaleDateString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium capitalize",
        status === "confirmed" && "bg-[#E8F8F1] text-[#166534]",
        status === "pending" && "bg-[#FEFAE0] text-[#854D0E]",
        status !== "confirmed" && status !== "pending" && "bg-cream text-text/60",
      )}
    >
      {status}
    </span>
  );
}

export default PurchaseHistoryPage;
