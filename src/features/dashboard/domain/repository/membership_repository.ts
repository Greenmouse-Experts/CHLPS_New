import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { ok, fail, ApiResponse } from "@/lib/network/entity/api_response";
import { OrderService } from "@/features/orders/services/order_service";
import { fetchPublicMembershipBySlug } from "@/features/membership/services/membership_service";

export type UserMembershipStatus =
  | "active"
  | "confirmed"
  | "pending"
  | "expired"
  | "cancelled";

export interface UserPaidMembership {
  id: string;
  name: string;
  slug?: string;
  status: UserMembershipStatus;
  tier?: string;
  startDate?: string;
  expiryDate?: string;
  currency?: string;
  price?: number;
  duration?: string;
  orderNumber?: string;
  benefits?: string[];
  certificateUrl?: string;
  autoRenewal?: boolean;
  memberNumber?: string;
}

export class MembershipRepository {
  private api = new ApiService();
  private orderService = new OrderService();

  /**
   * Fetches the student's active/paid membership from student memberships,
   * confirmed orders, or approved membership applications.
   */
  async getUserPaidMembership(
    userId?: string,
  ): Promise<ApiResponse<UserPaidMembership | null>> {
    try {
      // 1. Try dedicated student memberships endpoint if userId exists
      if (userId) {
        try {
          const directRes = await this.api.getData<any>(
            ApiUrls.studentMembershipsByStudent(userId),
          );
          if (directRes.success && directRes.data) {
            const rawList = Array.isArray(directRes.data)
              ? directRes.data
              : (directRes.data?.data ?? []);
            const activeSub =
              rawList.find(
                (item: any) =>
                  item.status === "active" || item.status === "confirmed",
              ) || rawList[0];

            if (activeSub && activeSub.membership) {
              const mem = activeSub.membership;
              return ok({
                id: mem.id || activeSub.id,
                name: mem.name || "ChLPS Membership",
                slug: mem.slug,
                status: activeSub.status || "active",
                tier: mem.name,
                startDate: activeSub.startDate || activeSub.createdDate,
                expiryDate: activeSub.expiryDate,
                currency: mem.currency || "CAD",
                price: mem.price,
                duration: mem.duration || "1 Year",
                benefits: mem.benefits || [],
                autoRenewal: activeSub.autoRenewal ?? true,
                memberNumber: `CHLPS-${(activeSub.id || userId).slice(0, 8).toUpperCase()}`,
              });
            }
          }
        } catch {
          // Fall through to order lookup
        }
      }

      // 2. Scan confirmed student transactions for purchased memberships
      const trxRes = await this.orderService.fetchStudentTransactions();
      if (trxRes.success && trxRes.data && trxRes.data.length > 0) {
        // Find the latest confirmed or successful order with a membership item
        for (const order of trxRes.data) {
          const isPaid =
            order.status?.toLowerCase() === "confirmed" ||
            order.status?.toLowerCase() === "successful";

          if (order.orderItems && order.orderItems.length > 0) {
            const memItem = order.orderItems.find((it) =>
              Boolean(it.membership),
            );
            if (memItem && memItem.membership) {
              const mem = memItem.membership;
              const startDate = order.createdDate || new Date().toISOString();
              const startObj = new Date(startDate);
              const expiryObj = new Date(startObj);
              expiryObj.setFullYear(expiryObj.getFullYear() + 1);

              // Enrich with full membership details if slug is known
              let benefits: string[] = [];
              let duration = "1 Year";
              let currency = "CAD";
              let price = memItem.price || order.trx?.amount || 0;

              if (mem.slug) {
                try {
                  const details = await fetchPublicMembershipBySlug(mem.slug);
                  if (details) {
                    if (details.benefits) benefits = details.benefits;
                    if (details.duration) duration = details.duration;
                    if (details.currency) currency = details.currency;
                    if (details.price) price = details.price;
                  }
                } catch {
                  // Keep fallback values
                }
              }

              return ok({
                id: mem.id || order.id,
                name: mem.name || "Chartered Member",
                slug: mem.slug,
                status: isPaid ? "active" : "pending",
                tier: mem.name,
                startDate,
                expiryDate: expiryObj.toISOString(),
                currency,
                price,
                duration,
                orderNumber: order.number,
                benefits,
                autoRenewal: true,
                memberNumber: `CHLPS-${(order.number || mem.id)
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .slice(-8)
                  .toUpperCase()}`,
              });
            }
          }
        }
      }

      // 3. Check membership applications for approved submissions
      const appRes = await this.orderService.fetchMyMembershipApplications();
      if (appRes.success && appRes.data && appRes.data.length > 0) {
        const latestApp = appRes.data[0];
        if (latestApp.membership) {
          const mem = latestApp.membership;
          const isApproved =
            latestApp.status === "approved" || latestApp.status === "paid";

          return ok({
            id: latestApp.membershipId || latestApp.id,
            name: mem.name || "Membership",
            slug: mem.slug,
            status: isApproved ? "active" : "pending",
            tier: mem.name,
            startDate: latestApp.createdDate,
            benefits: [],
            memberNumber: `CHLPS-APP-${latestApp.id.slice(0, 6).toUpperCase()}`,
          });
        }
      }

      return ok(null);
    } catch (error: any) {
      return fail(
        error?.message || "Failed to load membership information.",
        500,
      );
    }
  }
}
