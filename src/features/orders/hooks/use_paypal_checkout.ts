"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { orderService } from "../services/order_service";
import type {
  OrderItemInput,
  OrderPreviewCalculations,
  OrderCreateResponseData,
} from "@/types/orders";

interface UsePaypalCheckoutOptions {
  onSuccess?: (order: OrderCreateResponseData) => void;
  onError?: (error: Error) => void;
}

export function usePaypalCheckout(options?: UsePaypalCheckoutOptions) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [preview, setPreview] = useState<OrderPreviewCalculations | null>(null);
  const [order, setOrder] = useState<OrderCreateResponseData | null>(null);

  /**
   * Fetches the preview calculation for the cart items.
   * Endpoint: POST /orders/preview
   */
  const getPreview = useCallback(
    async (params: {
      amount: number;
      courses?: OrderItemInput[];
      memberships?: OrderItemInput[];
    }) => {
      setIsPreviewing(true);
      try {
        const res = await orderService.previewOrder({
          amount: params.amount,
          courses: params.courses,
          memberships: params.memberships,
        });

        if (res.status && res.data) {
          setPreview(res.data);
          return res.data;
        } else {
          toast.error(res.message || "Failed to preview order");
          return null;
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to calculate order preview");
        return null;
      } finally {
        setIsPreviewing(false);
      }
    },
    [],
  );

  /**
   * Initiates order checkout with preview validation before order creation.
   * Guaranteed order of execution:
   * 1. POST /orders/preview
   * 2. POST /orders/create
   */
  const initiateCheckout = useCallback(
    async (params: {
      courses?: OrderItemInput[];
      memberships?: OrderItemInput[];
      callback_url?: string;
      estimatedAmount?: number;
    }) => {
      setIsCheckingOut(true);
      try {
        const result = await orderService.checkoutWithPreview(params);
        setPreview(result.preview);
        setOrder(result.order);

        const redirectUrl =
          result.order.authorization_url ||
          result.order.authorizationUrl ||
          result.order.approvalUrl ||
          result.order.approval_url;

        // Redirect to external PayPal checkout if redirect URL provided
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }

        options?.onSuccess?.(result.order);
        return result;
      } catch (err: any) {
        const error =
          err instanceof Error ? err : new Error(String(err));
        toast.error(error.message || "PayPal checkout failed.");
        options?.onError?.(error);
        return null;
      } finally {
        setIsCheckingOut(false);
      }
    },
    [options],
  );

  /**
   * Confirms payment reference after PayPal approval
   * Endpoint: POST /orders/confirm/:thirdPartyRef
   */
  const confirmPayment = useCallback(
    async (thirdPartyRef: string) => {
      try {
        const res = await orderService.confirmOrder(thirdPartyRef);
        if (res.status) {
          toast.success("Payment verified successfully!");
          return res.data;
        } else {
          toast.error(res.message || "Payment verification failed");
          return null;
        }
      } catch (err: any) {
        toast.error(err?.message || "Payment confirmation error");
        return null;
      }
    },
    [],
  );

  return {
    isPreviewing,
    isCheckingOut,
    preview,
    order,
    getPreview,
    initiateCheckout,
    confirmPayment,
  };
}

// Backwards compatibility alias
export const useStripeCheckout = usePaypalCheckout;
export default usePaypalCheckout;
