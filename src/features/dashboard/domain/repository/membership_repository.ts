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
  certificateId?: string;
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
  certificateUrl?: string;
  certificateId?: string;
  answers?: Array<{
    questionId: string;
    questionText?: string;
    answer: boolean;
  }>;
}

export interface MembershipCertificateResult {
  certificateUrl?: string;
  certificateId?: string;
  certificateNumber?: string;
  issuedDate?: string;
  membershipId?: string;
  studentId?: string;
  [key: string]: any;
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

function resolveBadge(slugOrName?: string, remoteImage?: string | null) {
  return resolveMembershipBadge(slugOrName, remoteImage);
}

function normalizeMembershipStatus(status: any): UserMembershipStatus {
  if (!status) return "pending_approval";
  const s = String(status).toLowerCase().trim();
  switch (s) {
    case "active":
    case "confirmed":
      return "active";
    case "approved":
      return "approved";
    case "expired":
      return "expired";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "rejected":
    case "declined":
      return "rejected";
    case "pending_approval":
    case "under_review":
    case "pending":
    default:
      return "pending_approval";
  }
}

function extractCertificateData(
  payload: any,
): MembershipCertificateResult | null {
  if (!payload) return null;
  const raw = payload?.data?.data ?? payload?.data ?? payload;

  if (Array.isArray(raw)) {
    if (raw.length === 0) return null;
    const cert = raw[0];
    const url = cert.certificateUrl || cert.url || cert.fileUrl;
    if (url) {
      return {
        certificateUrl: url,
        certificateId: cert.id || cert.certificateId || cert.certificateNumber,
        certificateNumber: cert.certificateNumber,
        issuedDate: cert.issuedDate || cert.createdAt,
        ...cert,
      };
    }
    return null;
  }

  if (typeof raw === "object") {
    const url =
      raw.certificateUrl ||
      raw.url ||
      raw.fileUrl ||
      raw.certificate?.certificateUrl ||
      raw.certificate?.url;
    const id =
      raw.id ||
      raw.certificateId ||
      raw.certificateNumber ||
      raw.certificate?.id;
    if (url || id) {
      return {
        certificateUrl: url,
        certificateId: id,
        certificateNumber:
          raw.certificateNumber || raw.certificate?.certificateNumber,
        issuedDate:
          raw.issuedDate || raw.createdAt || raw.certificate?.issuedDate,
        ...raw,
      };
    }
  }

  return null;
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
    certificateUrl:
      app.certificateUrl ||
      app.certificate?.certificateUrl ||
      mem.certificateUrl,
    certificateId:
      app.certificateId || app.certificate?.certificateId || mem.certificateId,
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
            item.membershipId === id ||
            item.applicationId === id ||
            item.membership?.id === id,
        );
        if (match) {
          return ok(mapRawApplicationToDetail(match));
        }
      }

      return ok(null);
    } catch (error: any) {
      return fail(
        error?.message || "Failed to fetch membership application.",
        500,
      );
    }
  }

  /**
   * Fetches the user's primary active membership.
   */
  async getUserPaidMembership(
    _userId?: string,
  ): Promise<ApiResponse<UserPaidMembership | null>> {
    try {
      const res = await this.getMyMembershipApplications();
      if (!res.success || !res.data) {
        return ok(null);
      }

      const activeApp =
        res.data.find((a) => a.status === "active") ||
        res.data.find((a) => a.status === "approved") ||
        res.data[0];

      if (!activeApp) return ok(null);

      return ok({
        id: activeApp.id,
        name: activeApp.name,
        slug: activeApp.slug,
        status: activeApp.status as UserMembershipStatus,
        tier: activeApp.tier,
        startDate: activeApp.startDate,
        expiryDate: activeApp.expiryDate,
        currency: activeApp.currency,
        price: activeApp.price,
        duration: activeApp.duration,
        memberNumber: activeApp.memberNumber,
        certificateUrl: activeApp.certificateUrl,
        certificateId: activeApp.certificateId,
      });
    } catch (error: any) {
      return fail(error?.message || "Failed to fetch active membership.", 500);
    }
  }

  /**
   * Fetches specific membership certificate using candidate endpoints:
   * 1. GET /certificates/membership/:membershipId
   * 2. GET /certificates/student/:studentId/membership/:membershipId
   * 3. GET /certificates/membership/:membershipId/all
   * 4. GET /certificates?type=membership
   */
  async getMembershipCertificate(
    membershipId: string,
    studentId?: string,
  ): Promise<ApiResponse<MembershipCertificateResult | null>> {
    if (!membershipId) return ok(null);

    // 1. Direct candidate: GET /certificates/membership/:membershipId
    try {
      const res1: any = await simpleApiClient.get(
        `certificates/membership/${membershipId}`,
      );
      const parsed1 = extractCertificateData(res1);
      if (parsed1?.certificateUrl) {
        return ok(parsed1);
      }
    } catch {
      // Continue to next endpoint
    }

    // 2. Candidate: GET /certificates/membership/:membershipId/all
    try {
      const res2: any = await simpleApiClient.get(
        `certificates/membership/${membershipId}/all`,
      );
      const parsed2 = extractCertificateData(res2);
      if (parsed2?.certificateUrl) {
        return ok(parsed2);
      }
    } catch {
      // Continue to next endpoint
    }

    // 3. Candidate: GET /certificates/student/:studentId/membership/:membershipId
    if (studentId) {
      try {
        const res3: any = await simpleApiClient.get(
          `certificates/student/${studentId}/membership/${membershipId}`,
        );
        const parsed3 = extractCertificateData(res3);
        if (parsed3?.certificateUrl) {
          return ok(parsed3);
        }
      } catch {
        // Continue to next endpoint
      }
    }

    // 4. Candidate: Filter on general certificates endpoint: GET /certificates?type=membership
    try {
      const res4: any = await simpleApiClient.get("certificates", {
        params: { type: "membership" },
      });
      const raw4 = res4?.data?.data ?? res4?.data ?? res4;
      if (Array.isArray(raw4)) {
        const match = raw4.find(
          (c: any) =>
            c.membershipId === membershipId ||
            c.applicationId === membershipId ||
            c.membership?.id === membershipId,
        );
        if (match) {
          const parsed4 = extractCertificateData(match);
          if (parsed4?.certificateUrl) {
            return ok(parsed4);
          }
        }
      }
    } catch {
      // No certificate found
    }

    return ok(null);
  }

  /**
   * Fetches all enrolled memberships of the student.
   * Endpoint: GET /student-memberships/mine
   */
  async getMyStudentMemberships(): Promise<
    ApiResponse<UserEnrolledMembership[]>
  > {
    try {
      const res = await simpleApiClient.get("memberships/my-memberships");
      // const res = await simpleApiClient.get("student-memberships/mine");
      const raw = res?.data ?? res;
      let list: UserEnrolledMembership[] = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (Array.isArray(raw.data)) {
        list = raw.data;
      }
      return ok(list);
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch enrolled memberships.",
        500,
      );
    }
  }

  /**
   * Alias for getMyStudentMemberships
   */
  async getMyEnrolledMemberships(): Promise<
    ApiResponse<UserEnrolledMembership[]>
  > {
    return this.getMyStudentMemberships();
  }
}

export const membershipRepository = new MembershipRepository();
