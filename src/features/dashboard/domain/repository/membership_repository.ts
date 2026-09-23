import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { ok, fail, ApiResponse } from "@/lib/network/entity/api_response";
import { OrderService } from "@/features/orders/services/order_service";
import {
  fetchPublicMembershipBySlug,
  fetchPublicMemberships,
} from "@/features/membership/services/membership_service";
import { Assets } from "@/lib/assets";

export type UserMembershipStatus =
  | "active"
  | "confirmed"
  | "pending"
  | "under_review"
  | "approved"
  | "expired"
  | "cancelled"
  | "rejected";

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

export interface UserMembershipDetail {
  id: string; // application id or membership id
  applicationId?: string;
  membershipId: string;
  name: string;
  slug?: string;
  status: UserMembershipStatus | string;
  tier?: string;
  appliedDate?: string;
  updatedDate?: string;
  startDate?: string;
  expiryDate?: string;
  currency?: string;
  price?: number;
  duration?: string;
  description?: string;
  badge?: string;
  benefits?: string[];
  eligibilityCriteria?: string[];
  orderNumber?: string;
  memberNumber?: string;
  autoRenewal?: boolean;
  answers?: Array<{
    questionId: string;
    questionText?: string;
    answer: boolean;
  }>;
}

const badgeMap: Record<string, string> = {
  student: Assets.images.membership.student,
  affiliate: Assets.images.membership.affiliate,
  licentiate: Assets.images.membership.licentiate,
  associate: Assets.images.membership.associate,
  certified: Assets.images.membership.certified,
  corporate: Assets.icons.logo,
};

function resolveBadge(needle: string, remoteImage?: string): string {
  if (
    remoteImage &&
    (remoteImage.startsWith("http") || remoteImage.startsWith("/"))
  ) {
    return remoteImage;
  }
  const clean = needle.toLowerCase();
  for (const [key, asset] of Object.entries(badgeMap)) {
    if (clean.includes(key)) {
      return asset;
    }
  }
  return Assets.icons.logo;
}

export class MembershipRepository {
  private api = new ApiService();
  private orderService = new OrderService();

  /**
   * Fetches all membership applications submitted by the user,
   * merged with any paid or active membership subscriptions.
   */
  async getMyMembershipApplications(
    userId?: string,
  ): Promise<ApiResponse<UserMembershipDetail[]>> {
    try {
      const itemsMap = new Map<string, UserMembershipDetail>();

      // 1. Fetch user's membership applications
      const appRes = await this.orderService.fetchMyMembershipApplications();
      if (appRes.success && appRes.data && Array.isArray(appRes.data)) {
        for (const app of appRes.data) {
          const mem = app.membership;
          const membershipId = app.membershipId || mem?.id || app.id;
          const slug = mem?.slug;
          const name = mem?.name || "Membership Application";
          const rawStatus = (app.status || "under_review").toLowerCase();

          let status: UserMembershipStatus = "under_review";
          if (rawStatus === "approved" || rawStatus === "accepted") {
            status = "approved";
          } else if (
            rawStatus === "paid" ||
            rawStatus === "active" ||
            rawStatus === "confirmed"
          ) {
            status = "active";
          } else if (rawStatus === "rejected" || rawStatus === "declined") {
            status = "rejected";
          }

          const questionsMap = new Map<string, string>();
          if (
            mem?.applicationQuestions &&
            Array.isArray(mem.applicationQuestions)
          ) {
            for (const q of mem.applicationQuestions) {
              if (q.id) questionsMap.set(q.id, q.question);
            }
          }

          const answers = (app.answers || []).map((ans) => ({
            questionId: ans.questionId,
            questionText: questionsMap.get(ans.questionId) || "",
            answer: ans.answer,
          }));

          const item: UserMembershipDetail = {
            id: app.id,
            applicationId: app.id,
            membershipId,
            name,
            slug,
            status,
            tier: name,
            appliedDate: app.createdDate,
            updatedDate: app.updatedDate,
            currency: (mem as any)?.currency || "CAD",
            price: (mem as any)?.price,
            duration: (mem as any)?.duration || "1 Year",
            description: (mem as any)?.description,
            badge: resolveBadge(`${slug || ""} ${name}`, (mem as any)?.image),
            benefits: (mem as any)?.benefits || [],
            eligibilityCriteria: (mem as any)?.eligibilityCriteria || [],
            answers,
          };

          itemsMap.set(app.id, item);
        }
      }

      // 2. Fetch student transactions for confirmed/paid membership orders
      try {
        const trxRes = await this.orderService.fetchStudentTransactions();
        if (trxRes.success && trxRes.data && trxRes.data.length > 0) {
          for (const order of trxRes.data) {
            const isPaid =
              order.status?.toLowerCase() === "confirmed" ||
              order.status?.toLowerCase() === "successful";

            if (order.orderItems && order.orderItems.length > 0) {
              for (const it of order.orderItems) {
                if (it.membership) {
                  const mem = it.membership;
                  const targetId = mem.id;

                  // Find if an existing application maps to this membership
                  let existingKey: string | undefined;
                  for (const [key, val] of itemsMap.entries()) {
                    if (
                      val.membershipId === targetId ||
                      (val.slug && val.slug === mem.slug)
                    ) {
                      existingKey = key;
                      break;
                    }
                  }

                  const startDate =
                    order.createdDate || new Date().toISOString();
                  const startObj = new Date(startDate);
                  const expiryObj = new Date(startObj);
                  expiryObj.setFullYear(expiryObj.getFullYear() + 1);
                  const memberNumber = `CHLPS-${(order.number || mem.id)
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .slice(-8)
                    .toUpperCase()}`;

                  if (existingKey) {
                    const existing = itemsMap.get(existingKey)!;
                    itemsMap.set(existingKey, {
                      ...existing,
                      status: isPaid ? "active" : existing.status,
                      orderNumber: order.number,
                      memberNumber,
                      startDate,
                      expiryDate: expiryObj.toISOString(),
                      price: it.price ?? existing.price,
                    });
                  } else {
                    const id = order.id || mem.id;
                    itemsMap.set(id, {
                      id,
                      membershipId: mem.id,
                      name: mem.name || "ChLPS Membership",
                      slug: mem.slug,
                      status: isPaid ? "active" : "pending",
                      tier: mem.name,
                      appliedDate: order.createdDate,
                      startDate,
                      expiryDate: expiryObj.toISOString(),
                      currency: "CAD",
                      price: it.price || order.trx?.amount,
                      duration: "1 Year",
                      orderNumber: order.number,
                      memberNumber,
                      badge: resolveBadge(`${mem.slug || ""} ${mem.name}`),
                    });
                  }
                }
              }
            }
          }
        }
      } catch {
        // Continue even if transaction fetch fails
      }

      // 3. Check student-memberships direct endpoint if userId exists
      if (userId) {
        try {
          const directRes = await this.api.getData<any>(
            ApiUrls.studentMembershipsByStudent(userId),
          );
          if (directRes.success && directRes.data) {
            const rawList = Array.isArray(directRes.data)
              ? directRes.data
              : (directRes.data?.data ?? []);
            for (const sub of rawList) {
              if (sub.membership) {
                const mem = sub.membership;
                let existingKey: string | undefined;
                for (const [key, val] of itemsMap.entries()) {
                  if (
                    val.membershipId === mem.id ||
                    (val.slug && val.slug === mem.slug)
                  ) {
                    existingKey = key;
                    break;
                  }
                }

                const isActive =
                  sub.status === "active" || sub.status === "confirmed";
                const memberNum = `CHLPS-${(sub.id || userId).slice(0, 8).toUpperCase()}`;

                if (existingKey) {
                  const existing = itemsMap.get(existingKey)!;
                  itemsMap.set(existingKey, {
                    ...existing,
                    status: isActive ? "active" : existing.status,
                    startDate: sub.startDate || existing.startDate,
                    expiryDate: sub.expiryDate || existing.expiryDate,
                    memberNumber: existing.memberNumber || memberNum,
                  });
                } else {
                  const id = sub.id || mem.id;
                  itemsMap.set(id, {
                    id,
                    membershipId: mem.id,
                    name: mem.name || "ChLPS Membership",
                    slug: mem.slug,
                    status: isActive ? "active" : sub.status || "pending",
                    tier: mem.name,
                    appliedDate: sub.createdDate,
                    startDate: sub.startDate,
                    expiryDate: sub.expiryDate,
                    currency: mem.currency || "CAD",
                    price: mem.price,
                    duration: mem.duration || "1 Year",
                    memberNumber: memberNum,
                    badge: resolveBadge(
                      `${mem.slug || ""} ${mem.name}`,
                      mem.image,
                    ),
                  });
                }
              }
            }
          }
        } catch {
          // Continue
        }
      }

      // Convert map to array and sort by applied date descending
      const list = Array.from(itemsMap.values()).sort((a, b) => {
        const da = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
        const db = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
        return db - da;
      });

      return ok(list);
    } catch (error: any) {
      return fail(
        error?.message || "Failed to fetch user membership applications.",
        500,
      );
    }
  }

  /**
   * Fetches full individual membership application by ID, application ID, or slug.
   */
  async getMyMembershipApplicationById(
    id: string,
    userId?: string,
  ): Promise<ApiResponse<UserMembershipDetail | null>> {
    try {
      const allRes = await this.getMyMembershipApplications(userId);
      let match: UserMembershipDetail | undefined;

      if (allRes.success && allRes.data) {
        match = allRes.data.find(
          (item) =>
            item.id === id ||
            item.applicationId === id ||
            item.membershipId === id ||
            (item.slug && item.slug === id),
        );
      }

      // If we found the match, enrich it with full public membership details (questions, benefits)
      if (match) {
        const lookupSlug = match.slug || match.membershipId;
        if (lookupSlug) {
          try {
            const publicMem = await fetchPublicMembershipBySlug(lookupSlug);
            if (publicMem) {
              const questionsMap = new Map<string, string>();
              if (
                publicMem.applicationQuestions &&
                Array.isArray(publicMem.applicationQuestions)
              ) {
                for (const q of publicMem.applicationQuestions) {
                  if (q.id) questionsMap.set(q.id, q.question);
                }
              }

              const enrichedAnswers = (match.answers || []).map((ans) => ({
                questionId: ans.questionId,
                questionText:
                  ans.questionText || questionsMap.get(ans.questionId) || "",
                answer: ans.answer,
              }));

              return ok({
                ...match,
                description: match.description || publicMem.description,
                benefits:
                  match.benefits && match.benefits.length > 0
                    ? match.benefits
                    : publicMem.benefits || [],
                eligibilityCriteria:
                  match.eligibilityCriteria &&
                  match.eligibilityCriteria.length > 0
                    ? match.eligibilityCriteria
                    : publicMem.eligibilityCriteria || [],
                price: match.price ?? publicMem.price,
                currency: match.currency || publicMem.currency || "CAD",
                duration: match.duration || publicMem.duration || "1 Year",
                badge:
                  match.badge ||
                  resolveBadge(
                    `${publicMem.slug || ""} ${publicMem.name}`,
                    publicMem.image,
                  ),
                answers: enrichedAnswers,
              });
            }
          } catch {
            // Return match as is
          }
        }
        return ok(match);
      }

      // Fallback: If not found in user applications, try fetching public membership
      // to allow viewing requirements and applying directly
      try {
        const publicMem = await fetchPublicMembershipBySlug(id);
        if (publicMem) {
          return ok({
            id: publicMem.id,
            membershipId: publicMem.id,
            name: publicMem.name,
            slug: publicMem.slug,
            status: "not_applied",
            tier: publicMem.name,
            description: publicMem.description,
            price: publicMem.price,
            currency: publicMem.currency || "CAD",
            duration: publicMem.duration || "1 Year",
            badge: resolveBadge(
              `${publicMem.slug || ""} ${publicMem.name}`,
              publicMem.image,
            ),
            benefits: publicMem.benefits || [],
            eligibilityCriteria: publicMem.eligibilityCriteria || [],
          });
        }
      } catch {
        // Not found
      }

      return ok(null);
    } catch (error: any) {
      return fail(error?.message || "Failed to load membership details.", 500);
    }
  }

  /**
   * Fetches the student's active/paid membership from student memberships,
   * confirmed orders, or approved membership applications.
   * Kept for backwards compatibility with the main dashboard.
   */
  async getUserPaidMembership(
    userId?: string,
  ): Promise<ApiResponse<UserPaidMembership | null>> {
    try {
      const all = await this.getMyMembershipApplications(userId);
      if (all.success && all.data && all.data.length > 0) {
        // Find active/confirmed first, then approved
        const active =
          all.data.find((item) => item.status === "active") ||
          all.data.find((item) => item.status === "approved");

        if (active) {
          return ok({
            id: active.membershipId || active.id,
            name: active.name,
            slug: active.slug,
            status: (active.status === "active"
              ? "active"
              : "pending") as UserMembershipStatus,
            tier: active.tier || active.name,
            startDate: active.startDate || active.appliedDate,
            expiryDate: active.expiryDate,
            currency: active.currency || "CAD",
            price: active.price,
            duration: active.duration || "1 Year",
            orderNumber: active.orderNumber,
            benefits: active.benefits || [],
            autoRenewal: active.autoRenewal ?? true,
            memberNumber:
              active.memberNumber ||
              `CHLPS-${active.id.slice(0, 8).toUpperCase()}`,
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
