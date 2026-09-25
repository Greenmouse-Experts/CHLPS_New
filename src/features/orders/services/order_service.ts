import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { ApiResponse, ok, fail } from "@/lib/network/entity/api_response";
import type {
  OrderPreviewPayload,
  OrderPreviewCalculations,
  OrderCreatePayload,
  OrderCreateResponseData,
  OrderConfirmResponseData,
  LiveOrderRecord,
  CourseApplication,
  SubmitCourseApplicationPayload,
  MembershipApplication,
  SubmitMembershipApplicationPayload,
} from "@/types/orders";

export class OrderService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  /**
   * 1. PREVIEW ORDER
   * Calculates subtotal, discounts, tax, and total before placing an order.
   * Endpoint: POST /orders/preview
   */
  async previewOrder(
    payload: OrderPreviewPayload,
  ): Promise<ApiResponse<OrderPreviewCalculations>> {
    try {
      const response = await this.api.postData<OrderPreviewPayload, any>(
        ApiUrls.ordersPreview,
        payload,
      );

      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: OrderPreviewCalculations = raw.data ?? raw;
        return ok(
          actualData,
          raw.message || response.message || "Order preview calculated",
        );
      }
      return fail(
        response.message || "Failed to calculate order preview",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to calculate order preview.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 2. CREATE ORDER
   * Generates order record and provides PayPal checkout reference.
   * Endpoint: POST /orders/create
   */
  async createOrder(
    payload: OrderCreatePayload,
  ): Promise<ApiResponse<OrderCreateResponseData>> {
    try {
      const response = await this.api.postData<OrderCreatePayload, any>(
        ApiUrls.ordersCreate,
        payload,
      );

      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: OrderCreateResponseData = raw.data ?? raw;
        return ok(
          actualData,
          raw.message || response.message || "Order created successfully",
        );
      }
      return fail(
        response.message || "Failed to create order",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create order.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 3. MANDATORY PREVIEW + CREATE PIPELINE
   * Enforces business rule: Always call POST /orders/preview before POST /orders/create.
   */
  async checkoutWithPreview(params: {
    courses?: OrderCreatePayload["courses"];
    memberships?: OrderCreatePayload["memberships"];
    estimatedAmount?: number;
    callback_url?: string;
  }): Promise<{
    preview: OrderPreviewCalculations;
    order: OrderCreateResponseData;
  }> {
    const rawEstimated = params.estimatedAmount ?? 0;

    // Step A: Preview
    const previewRes = await this.previewOrder({
      amount: rawEstimated,
      courses: params.courses,
      memberships: params.memberships,
    });

    if (!previewRes.success || !previewRes.data) {
      throw new Error(
        previewRes.message || "Failed to generate checkout preview.",
      );
    }

    const verifiedSubAmount =
      previewRes.data.subAmount ?? previewRes.data.amount ?? rawEstimated;

    // Step B: Create Order
    const isMembershipOnly = Boolean(
      params.memberships &&
      params.memberships.length > 0 &&
      (!params.courses || params.courses.length === 0),
    );
    const defaultSuccessPath = isMembershipOnly
      ? "/dashboard/purchase-history?payment=success"
      : "/dashboard/courses?payment=success";

    const defaultCallback =
      typeof window !== "undefined"
        ? `${window.location.origin}${defaultSuccessPath}`
        : "";

    const createPayload: OrderCreatePayload = {
      amount: verifiedSubAmount,
      callback_url: params.callback_url || defaultCallback,
      courses: params.courses,
      memberships: params.memberships,
    };

    const orderRes = await this.createOrder(createPayload);
    if (!orderRes.success || !orderRes.data) {
      throw new Error(
        orderRes.message || "Order creation failed after preview calculation.",
      );
    }

    return {
      preview: previewRes.data,
      order: orderRes.data,
    };
  }

  /**
   * 4. CONFIRM ORDER
   * Verifies the third-party payment reference (PayPal) and unlocks purchased content.
   * Endpoint: POST /orders/confirm/:thirdPartyRef
   */
  async confirmOrder(
    thirdPartyRef: string,
  ): Promise<ApiResponse<OrderConfirmResponseData>> {
    try {
      const response = await this.api.postData<{}, any>(
        ApiUrls.ordersConfirm(thirdPartyRef),
        {},
      );
      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: OrderConfirmResponseData = raw.data ?? raw;
        return ok(
          actualData,
          raw.message || response.message || "Order confirmed",
        );
      }
      return fail(
        response.message || "Payment confirmation failed",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Payment confirmation failed.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 5. CANCEL PENDING ORDER
   * Cancels an unfulfilled checkout order.
   * Endpoint: POST /orders/cancel-order/:orderNumber
   */
  async cancelOrder(
    orderNumber: string,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.api.postData<{}, any>(
        ApiUrls.ordersCancel(orderNumber),
        {},
      );
      if (response.success && response.data) {
        const raw = response.data as any;
        return ok(raw, raw.message || response.message || "Order cancelled");
      }
      return fail(
        response.message || "Failed to cancel order",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel order.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 6. FETCH STUDENT TRANSACTIONS
   * Endpoint: GET /orders/fetch-student-trx
   */
  async fetchStudentTransactions(): Promise<ApiResponse<LiveOrderRecord[]>> {
    try {
      const response = await this.api.getData<any>(ApiUrls.studentTransactions);
      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: LiveOrderRecord[] = Array.isArray(raw)
          ? raw
          : (raw.data ?? raw.results ?? []);
        return ok(actualData);
      }
      return fail(
        response.message || "Failed to fetch transaction history",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch transaction history.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 7. FETCH MY COURSE APPLICATION
   * Checks if the student has already completed screening / assessment for this course.
   * Endpoint: GET /course-applications/mine/:courseId
   */
  async fetchMyCourseApplication(
    courseId: string,
  ): Promise<ApiResponse<CourseApplication | null>> {
    try {
      const response = await this.api.getData<any>(
        ApiUrls.myCourseApplication(courseId),
      );

      if (response.success) {
        const raw = response.data as any;
        if (!raw || typeof raw !== "object" || !raw.id) {
          return ok(null);
        }
        return ok(raw as CourseApplication);
      }

      if (response.status === 404) {
        return ok(null);
      }

      return fail(
        response.message || "Failed to fetch course application",
        response.status || 400,
      );
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return ok(null);
      }
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch course application.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 8. FETCH ALL MY COURSE APPLICATIONS
   * Endpoint: GET /course-applications/mine
   */
  async fetchMyCourseApplications(): Promise<ApiResponse<CourseApplication[]>> {
    try {
      const response = await this.api.getData<any>(
        ApiUrls.myCourseApplications,
      );

      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: CourseApplication[] = Array.isArray(raw)
          ? raw
          : (raw.data ?? raw.results ?? []);
        return ok(actualData);
      }

      return fail(
        response.message || "Failed to fetch applications",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch course applications.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 9. SUBMIT COURSE APPLICATION / ASSESSMENT
   * Answers screening/assessment questions before purchasing course.
   * Endpoint: POST /course-applications/submit
   */
  async submitCourseApplication(
    payload: SubmitCourseApplicationPayload,
  ): Promise<ApiResponse<CourseApplication>> {
    try {
      const response = await this.api.postData<
        SubmitCourseApplicationPayload,
        any
      >(ApiUrls.courseApplicationSubmit, payload);

      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: CourseApplication = raw.data ?? raw;
        return ok(
          actualData,
          raw.message ||
            response.message ||
            "Application submitted successfully",
        );
      }

      return fail(
        response.message || "Failed to submit course questionnaire",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit course questionnaire.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 10. FETCH MY MEMBERSHIP APPLICATION
   * Checks if the student has already completed screening / assessment for this membership.
   * Endpoint: GET /membership-applications/mine/:membershipId
   */
  async fetchMyMembershipApplication(
    membershipId: string,
  ): Promise<ApiResponse<MembershipApplication | null>> {
    try {
      const response = await this.api.getData<any>(
        ApiUrls.myMembershipApplication(membershipId),
      );

      if (response.success) {
        const raw = response.data as any;
        if (!raw || typeof raw !== "object" || !raw.id) {
          return ok(null);
        }
        return ok(raw as MembershipApplication);
      }

      if (response.status === 404) {
        return ok(null);
      }

      return fail(
        response.message || "Failed to fetch membership application",
        response.status || 400,
      );
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return ok(null);
      }
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch membership application.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 11. FETCH ALL MY MEMBERSHIP APPLICATIONS
   * Endpoint: GET /membership-applications/mine
   */
  async fetchMyMembershipApplications(): Promise<
    ApiResponse<MembershipApplication[]>
  > {
    try {
      const response = await this.api.getData<any>(
        ApiUrls.myMembershipApplications,
      );

      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: MembershipApplication[] = Array.isArray(raw)
          ? raw
          : (raw.data ?? raw.results ?? []);
        return ok(actualData);
      }

      return fail(
        response.message || "Failed to fetch membership applications",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch membership applications.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 12. SUBMIT MEMBERSHIP APPLICATION / ASSESSMENT
   * Answers screening/assessment questions before purchasing membership.
   * Endpoint: POST /membership-applications/submit
   */
  async submitMembershipApplication(
    payload: SubmitMembershipApplicationPayload,
  ): Promise<ApiResponse<MembershipApplication>> {
    try {
      const response = await this.api.postData<
        SubmitMembershipApplicationPayload,
        any
      >(ApiUrls.membershipApplicationSubmit, payload);

      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: MembershipApplication = raw.data ?? raw;
        return ok(
          actualData,
          raw.message ||
            response.message ||
            "Application submitted successfully",
        );
      }

      return fail(
        response.message || "Failed to submit membership questionnaire",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit membership questionnaire.",
        error?.response?.status || 500,
      );
    }
  }
}

export const orderService = new OrderService();
