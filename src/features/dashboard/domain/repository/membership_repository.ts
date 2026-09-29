import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { ok, fail, ApiResponse } from "@/lib/network/entity/api_response";
import { OrderService } from "@/features/orders/services/order_service";
import {
  fetchPublicMembershipBySlug,
  fetchPublicMemberships,
} from "@/features/membership/services/membership_service";
import { Assets } from "@/lib/assets";
import simpleApiClient from "@/lib/network/simpleApi";
import type { UserEnrolledMembership } from "@/types";

export type { UserEnrolledMembership };

export type UserMembershipStatus =
  | "active"
  | "pending_approval"
  | "approved"
  | "expired"
  | "cancelled"
  | "rejected"
  | "pending"
  | "under_review"
  | "confirmed";

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
  rawStatus?: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectReason?: string | null;
  orderId?: string | null;
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

export function resolveMembershipBadge(
  slugOrName?: string,
  remoteImage?: string | null,
): string {
  if (
    remoteImage &&
    (remoteImage.startsWith("http://") ||
      remoteImage.startsWith("https://") ||
      remoteImage.startsWith("/"))
  ) {
    return remoteImage;
  }
  const clean = (slugOrName || "").toLowerCase();
  for (const [key, asset] of Object.entries(badgeMap)) {
    if (clean.includes(key)) {
      return asset;
    }
  }
  return Assets.icons.logo;
}

function resolveBadge(needle: string, remoteImage?: string): string {
  return resolveMembershipBadge(needle, remoteImage);
}

export function normalizeMembershipStatus(
  raw?: string | null,
): UserMembershipStatus {
  const s = (raw || "").toLowerCase().trim();
  if (s === "pending_approval" || s === "under_review" || s === "pending") {
    return "pending_approval";
  }
  if (
    s === "active" ||
    s === "confirmed" ||
    s === "paid" ||
    s === "successful"
  ) {
    return "active";
  }
  if (s === "expired") {
    return "expired";
  }
  if (s === "cancelled" || s === "canceled") {
    return "cancelled";
  }
  if (s === "approved" || s === "accepted") {
    return "approved";
  }
  if (s === "rejected" || s === "declined") {
    return "rejected";
  }
  return "pending_approval";
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
          const status = normalizeMembershipStatus(app.status);

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
            rawStatus: app.status,
            reviewedBy: app.reviewedBy,
            reviewedAt: app.reviewedAt,
            rejectReason: app.rejectReason,
            orderId: app.orderId,
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

      // Build lookup maps for existing items: by membershipId and by slug
      const findExistingKey = (
        targetId?: string,
        targetSlug?: string,
      ): string | undefined => {
        if (!targetId && !targetSlug) return undefined;
        for (const [key, val] of itemsMap.entries()) {
          if (targetId && val.membershipId === targetId) return key;
          if (targetSlug && val.slug && val.slug === targetSlug) return key;
        }
        return undefined;
      };

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
                  const existingKey = findExistingKey(mem.id, mem.slug);

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
                    const isTerminal =
                      existing.status === "cancelled" ||
                      existing.status === "rejected" ||
                      existing.status === "expired";
                    itemsMap.set(existingKey, {
                      ...existing,
                      status: isTerminal
                        ? existing.status
                        : isPaid
                          ? "active"
                          : existing.status,
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
                      status: isPaid ? "active" : "pending_approval",
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
        // Continue with applications only
      }

      // 3. Fallback: If no applications exist, show public membership options as draft cards
      if (itemsMap.size === 0) {
        try {
          const publicRes = await fetchPublicMemberships();
          if (publicRes && publicRes.length > 0) {
            for (const pub of publicRes) {
              itemsMap.set(pub.id, {
                id: pub.id,
                membershipId: pub.id,
                name: pub.name,
                slug: pub.slug,
                status: "pending_approval",
                tier: pub.name,
                description: pub.description,
                price: pub.price,
                currency: pub.currency || "CAD",
                duration: pub.duration || "1 Year",
                badge: resolveBadge(`${pub.slug || ""} ${pub.name}`, pub.image),
                benefits: pub.benefits || [],
                eligibilityCriteria: pub.eligibilityCriteria || [],
              });
            }
          }
        } catch {
          // Ignore fallback errors
        }
      }

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
   * Helper to map a raw MembershipApplication object into UserMembershipDetail
   * and enrich it with public membership criteria and details.
   */
  private async mapAndEnrichApplication(
    app: any,
  ): Promise<UserMembershipDetail> {
    const mem = app.membership;
    const membershipId = app.membershipId || mem?.id || app.id;
    const slug = mem?.slug;
    const name = mem?.name || "Membership Application";
    const status = normalizeMembershipStatus(app.status);

    const questionsMap = new Map<string, string>();
    if (mem?.applicationQuestions && Array.isArray(mem.applicationQuestions)) {
      for (const q of mem.applicationQuestions) {
        if (q.id) questionsMap.set(q.id, q.question);
      }
    }

    const answers = (app.answers || []).map((ans: any) => ({
      questionId: ans.questionId,
      questionText: questionsMap.get(ans.questionId) || "",
      answer: ans.answer,
    }));

    const detail: UserMembershipDetail = {
      id: app.id,
      applicationId: app.id,
      membershipId,
      name,
      slug,
      status,
      rawStatus: app.status,
      reviewedBy: app.reviewedBy,
      reviewedAt: app.reviewedAt,
      rejectReason: app.rejectReason,
      orderId: app.orderId,
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

    // Enrich with public membership data (questions, benefits, description) if missing or partial
    const lookupSlug = slug || membershipId;
    if (lookupSlug) {
      try {
        const publicMem = await fetchPublicMembershipBySlug(lookupSlug);
        if (publicMem) {
          if (
            publicMem.applicationQuestions &&
            Array.isArray(publicMem.applicationQuestions)
          ) {
            for (const q of publicMem.applicationQuestions) {
              if (q.id) questionsMap.set(q.id, q.question);
            }
          }

          const enrichedAnswers = (detail.answers || []).map((ans) => ({
            questionId: ans.questionId,
            questionText:
              ans.questionText || questionsMap.get(ans.questionId) || "",
            answer: ans.answer,
          }));

          return {
            ...detail,
            name: publicMem.name || detail.name,
            tier: publicMem.name || detail.tier,
            slug: publicMem.slug || detail.slug,
            description: detail.description || publicMem.description,
            benefits:
              detail.benefits && detail.benefits.length > 0
                ? detail.benefits
                : publicMem.benefits || [],
            eligibilityCriteria:
              detail.eligibilityCriteria &&
              detail.eligibilityCriteria.length > 0
                ? detail.eligibilityCriteria
                : publicMem.eligibilityCriteria || [],
            price: detail.price ?? publicMem.price,
            currency: detail.currency || publicMem.currency || "CAD",
            duration: detail.duration || publicMem.duration || "1 Year",
            badge:
              detail.badge ||
              resolveBadge(
                `${publicMem.slug || ""} ${publicMem.name}`,
                publicMem.image,
              ),
            answers: enrichedAnswers,
          };
        }
      } catch {
        // Return detail as is
      }
    }

    return detail;
  }

  /**
   * Fetches full individual membership application by membership ID or application ID.
   * Primary route: GET /membership-applications/mine/:membershipId
   * Fallbacks:
   * 1. Check user applications list (if id was application UUID or matched slug)
   * 2. Public membership detail (for direct view/not_applied state)
   */
  async getMyMembershipApplicationById(
    id: string,
    userId?: string,
  ): Promise<ApiResponse<UserMembershipDetail | null>> {
    try {
      if (!id) return ok(null);

      // 1. Try direct endpoint: GET /membership-applications/mine/:membershipId
      try {
        const directRes =
          await this.orderService.fetchMyMembershipApplication(id);
        if (directRes.success && directRes.data && directRes.data.id) {
          const enriched = await this.mapAndEnrichApplication(directRes.data);
          return ok(enriched);
        }
      } catch {
        // Direct call failed or returned 404, fallback to search across all applications
      }

      // 2. Fallback: Search user's full applications list (handles when id is applicationId or slug)
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

      // If we found a match from all applications:
      if (match) {
        // If it has a membershipId distinct from the passed id, try fetching direct with membershipId
        if (match.membershipId && match.membershipId !== id) {
          try {
            const directMemRes =
              await this.orderService.fetchMyMembershipApplication(
                match.membershipId,
              );
            if (
              directMemRes.success &&
              directMemRes.data &&
              directMemRes.data.id
            ) {
              const enriched = await this.mapAndEnrichApplication(
                directMemRes.data,
              );
              return ok(enriched);
            }
          } catch {
            // Keep using match
          }
        }

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

      // 3. Fallback: If not found in user applications, try fetching public membership
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
   * Fetches only active or enrolled memberships for the user directly
   * from /memberships/my-memberships.
   */
  async getMyEnrolledMemberships(): Promise<
    ApiResponse<UserEnrolledMembership[]>
  > {
    try {
      const resp = await simpleApiClient.get("memberships/my-memberships");
      const payload = resp.data;
      let list: UserEnrolledMembership[] = [];
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && Array.isArray(payload.data)) {
        list = payload.data;
      } else if (payload && payload.data && Array.isArray(payload.data.data)) {
        list = payload.data.data;
      }
      return ok(list);
    } catch (error: any) {
      return fail(
        error?.message || "Failed to fetch enrolled memberships.",
        500,
      );
    }
  }

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
