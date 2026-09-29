import { ok, fail, ApiResponse } from "@/lib/network/entity/api_response";
import { OrderService } from "@/features/orders/services/order_service";
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

function mapRawApplicationToDetail(app: any): UserMembershipDetail {
  const mem = app.membership || {};
  const membershipId = app.membershipId || mem.id || app.id;
  const slug = mem.slug || app.slug;
  const name = mem.name || app.name || "Membership Application";
  const status = normalizeMembershipStatus(app.status);

  const questionsMap = new Map<string, string>();
  if (mem.applicationQuestions && Array.isArray(mem.applicationQuestions)) {
    for (const q of mem.applicationQuestions) {
      if (q.id) questionsMap.set(q.id, q.question);
    }
  }

  const answers = (app.answers || []).map((ans: any) => ({
    questionId: ans.questionId,
    questionText: questionsMap.get(ans.questionId) || "",
    answer: ans.answer,
  }));

  return {
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
    appliedDate: app.createdDate || app.createdAt,
    updatedDate: app.updatedDate || app.updatedAt,
    startDate: app.startDate,
    expiryDate: app.endDate || app.expiryDate,
    currency: mem.currency || "CAD",
    price: mem.price,
    duration: mem.duration || "1 Year",
    description: mem.description,
    badge: resolveBadge(
      `${slug || ""} ${name}`,
      mem.image || mem.certificationImage,
    ),
    benefits: mem.benefits || [],
    eligibilityCriteria: mem.eligibilityCriteria || [],
    answers,
  };
}

export class MembershipRepository {
  private orderService = new OrderService();

  /**
   * Fetches only user membership applications directly from the /mine endpoint.
   * Endpoint: GET /membership-applications/mine
   */
  async getMyMembershipApplications(
    _userId?: string,
  ): Promise<ApiResponse<UserMembershipDetail[]>> {
    try {
      const appRes = await this.orderService.fetchMyMembershipApplications();
      if (!appRes.success || !appRes.data) {
        return ok([]);
      }

      const rawList = Array.isArray(appRes.data) ? appRes.data : [];
      const list: UserMembershipDetail[] = rawList.map((app) =>
        mapRawApplicationToDetail(app),
      );

      list.sort((a, b) => {
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
   * Fetches full individual membership application by ID strictly from user's /mine data.
   * Primary route: GET /membership-applications/mine/:membershipId
   * Fallback: Find matching application by id within GET /membership-applications/mine
   */
  async getMyMembershipApplicationById(
    id: string,
    _userId?: string,
  ): Promise<ApiResponse<UserMembershipDetail | null>> {
    try {
      if (!id) return ok(null);

      // 1. Try direct /membership-applications/mine/:membershipId
      try {
        const directRes =
          await this.orderService.fetchMyMembershipApplication(id);
        if (directRes.success && directRes.data && directRes.data.id) {
          return ok(mapRawApplicationToDetail(directRes.data));
        }
      } catch {
        // Direct call failed or id was application UUID
      }

      // 2. Search within user's /membership-applications/mine list
      const allRes = await this.orderService.fetchMyMembershipApplications();
      if (allRes.success && allRes.data && Array.isArray(allRes.data)) {
        const match = allRes.data.find(
          (item: any) =>
            item.id === id ||
            item.applicationId === id ||
            item.membershipId === id ||
            (item.membership?.id && item.membership.id === id) ||
            (item.membership?.slug && item.membership.slug === id),
        );

        if (match) {
          return ok(mapRawApplicationToDetail(match));
        }
      }

      return ok(null);
    } catch (error: any) {
      return fail(
        error?.message || "Failed to load membership application details.",
        500,
      );
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

  /**
   * Gets user's active paid membership from /memberships/my-memberships or /membership-applications/mine.
   */
  async getUserPaidMembership(
    userId?: string,
  ): Promise<ApiResponse<UserPaidMembership | null>> {
    try {
      // 1. Check enrolled memberships from /memberships/my-memberships
      const enrolledRes = await this.getMyEnrolledMemberships();
      if (
        enrolledRes.success &&
        enrolledRes.data &&
        enrolledRes.data.length > 0
      ) {
        const activeEnrolled =
          enrolledRes.data.find(
            (item) => (item.status || "").toLowerCase() === "active",
          ) || enrolledRes.data[0];

        if (activeEnrolled) {
          const mem = activeEnrolled.membership;
          return ok({
            id: activeEnrolled.id,
            name: mem?.name || "ChLPS Membership",
            slug: mem?.slug,
            status: "active",
            tier: mem?.name,
            startDate: activeEnrolled.startDate || activeEnrolled.createdDate,
            expiryDate: activeEnrolled.endDate,
            currency: mem?.currency || "CAD",
            price: mem?.price,
            duration: mem?.duration || "1 Year",
            orderNumber: activeEnrolled.orderItemId,
            benefits: mem?.benefits || [],
            autoRenewal: mem?.autoRenewal ?? true,
            memberNumber:
              activeEnrolled.memberNumber ||
              `CHLPS-${activeEnrolled.id.slice(0, 8).toUpperCase()}`,
          });
        }
      }

      // 2. Otherwise check applications from /membership-applications/mine
      const all = await this.getMyMembershipApplications(userId);
      if (all.success && all.data && all.data.length > 0) {
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
