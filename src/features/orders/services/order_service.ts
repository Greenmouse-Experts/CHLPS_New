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
   * Initializes a pending order and returns payment gateway authorization / secret.
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
          raw.message || response.message || "Order created",
        );
      }
      return fail(
        response.message || "Failed to initiate order",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to initiate order.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 3. COMBINED WORKFLOW: PREVIEW BEFORE CREATE
   * Guarantees that /orders/preview is always executed prior to /orders/create
   * to validate cart amounts, compute taxes, and prevent client-side price tampering.
   */
  async checkoutWithPreview(params: {
    courses?: Array<{ id: string; price: number; applicationId?: string }>;
    memberships?: Array<{ id: string; price: number; applicationId?: string }>;
    callback_url?: string;
    estimatedAmount?: number;
  }): Promise<{
    preview: OrderPreviewCalculations;
    order: OrderCreateResponseData;
  }> {
    const rawAmount =
      params.estimatedAmount ??
      [...(params.courses ?? []), ...(params.memberships ?? [])].reduce(
        (sum, item) => sum + (Number(item.price) || 0),
        0,
      );

    // Step 1: Call orders/preview FIRST
    const previewPayload: OrderPreviewPayload = {
      amount: rawAmount,
      courses: params.courses,
      memberships: params.memberships,
    };

    const previewRes = await this.previewOrder(previewPayload);
    if (!previewRes.success || !previewRes.data) {
      throw new Error(
        previewRes.message || "Failed to preview order totals from server.",
      );
    }

    // The backend expects amount to match the subtotal (sum of item prices),
    // and calculates tax internally before presenting to Stripe
    const verifiedSubAmount = previewRes.data.subAmount ?? rawAmount;

    // Step 2: Call orders/create with the verified preview calculation
    const defaultCallback =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard/purchase-history?status=verify`
        : "https://portal.chlps.org/dashboard/purchase-history?status=verify";

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
   * Verifies the third-party payment reference (Stripe / Paystack) and unlocks purchased content.
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
}

export const orderService = new OrderService();
