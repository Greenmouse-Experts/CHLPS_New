import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { ApiResponse, ok, fail } from "@/lib/network/entity/api_response";
import type { EventRegistration } from "@/types/events";

export interface EventRegistrationPaymentResult {
  registrationId?: string;
  ticketNumber?: string;
  reference?: string;
  thirdPartyRef?: string;
  authorization_url?: string;
  authorizationUrl?: string;
  clientSecret?: string;
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  status?: string;
}

export interface EventRegistrationResult {
  id?: string;
  ticketNumber?: string;
  status?: string;
  eventId?: string;
  meetingLink?: string;
  registrationDate?: string;
  event?: any;
}

export class EventRegistrationService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  /**
   * 1. Register for Paid Event
   * Calls POST /event-registrations/:eventId/register
   * Returns registration reference and payment redirect/clientSecret metadata.
   */
  async registerPaidEvent(
    eventId: string,
    callbackUrl?: string,
  ): Promise<ApiResponse<EventRegistrationPaymentResult>> {
    try {
      const defaultCallback =
        typeof window !== "undefined"
          ? `${window.location.origin}/events/${eventId}?payment=success`
          : "";

      const payload = {
        callback_url: callbackUrl || defaultCallback,
      };

      const response = await this.api.postData<
        typeof payload,
        EventRegistrationPaymentResult
      >(ApiUrls.eventRegister(eventId), payload);

      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: EventRegistrationPaymentResult = raw.data ?? raw;
        return ok(
          actualData,
          raw.message || response.message || "Event registration initiated",
        );
      }

      return fail(
        response.message || "Failed to initiate event payment",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to initiate event payment.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 2. Instant Join for Free Event
   * Calls POST /event-registrations/:eventId/join
   * Directly issues attendance pass and confirmation.
   */
  async joinFreeEvent(
    eventId: string,
  ): Promise<ApiResponse<EventRegistrationResult>> {
    try {
      const response = await this.api.postData<
        Record<string, unknown>,
        EventRegistrationResult
      >(ApiUrls.eventJoin(eventId), {});

      if (response.success && response.data) {
        const raw = response.data as any;
        const actualData: EventRegistrationResult = raw.data ?? raw;
        return ok(
          actualData,
          raw.message ||
            response.message ||
            "Successfully registered for event",
        );
      }

      return fail(
        response.message || "Failed to register for free event",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to register for free event.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 3. Confirm Event Payment
   * Calls POST /event-registrations/confirm/:thirdPartyRef
   */
  async confirmEventPayment(thirdPartyRef: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.postData<Record<string, unknown>, any>(
        ApiUrls.eventConfirm(thirdPartyRef),
        {},
      );

      if (response.success) {
        const raw = response.data as any;
        return ok(
          raw?.data ?? raw,
          raw?.message || response.message || "Payment verified successfully",
        );
      }

      return fail(
        response.message || "Failed to verify event payment",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to verify event payment.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 4. Get My Registered Events
   * Calls GET /event-registrations/my
   */
  async getMyEventRegistrations(): Promise<ApiResponse<EventRegistration[]>> {
    try {
      const response = await this.api.getData<EventRegistration[]>(
        ApiUrls.myEventRegistrations,
      );

      if (response.success && response.data) {
        const raw = response.data as any;
        let list: EventRegistration[] = [];
        if (Array.isArray(raw)) {
          list = raw;
        } else if (Array.isArray(raw.data)) {
          list = raw.data;
        }
        return ok(list, "Fetched event registrations");
      }

      return fail(
        response.message || "Failed to fetch event registrations",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch event registrations.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 5. Get Single Registration Ticket Detail
   * Calls GET /event-registrations/my/:registrationId
   */
  async getMyRegistration(
    registrationId: string,
  ): Promise<ApiResponse<EventRegistration>> {
    try {
      const response = await this.api.getData<EventRegistration>(
        ApiUrls.myEventRegistration(registrationId),
      );

      if (response.success && response.data) {
        const raw = response.data as any;
        return ok(raw.data ?? raw, "Fetched registration details");
      }

      return fail(
        response.message || "Failed to fetch registration",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch registration.",
        error?.response?.status || 500,
      );
    }
  }

  /**
   * 6. Cancel Attendance
   * Calls POST /event-registrations/my/:registrationId/cancel
   */
  async cancelRegistration(registrationId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.postData<Record<string, unknown>, any>(
        ApiUrls.cancelEventRegistration(registrationId),
        {},
      );

      if (response.success) {
        const raw = response.data as any;
        return ok(
          raw?.data ?? raw,
          raw?.message ||
            response.message ||
            "Registration cancelled successfully",
        );
      }

      return fail(
        response.message || "Failed to cancel registration",
        response.status || 400,
      );
    } catch (error: any) {
      return fail(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel registration.",
        error?.response?.status || 500,
      );
    }
  }
}

export const eventRegistrationService = new EventRegistrationService();
