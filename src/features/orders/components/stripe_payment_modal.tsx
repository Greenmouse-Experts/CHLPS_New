"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
  LockKeyIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import { getStripe } from "@/lib/stripe";
import { orderService } from "@/features/orders/services/order_service";
import type {
  OrderItemInput,
  OrderPreviewCalculations,
  OrderCreateResponseData,
} from "@/types/orders";

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  courses?: OrderItemInput[];
  memberships?: OrderItemInput[];
  estimatedAmount?: number;
  onSuccess?: (order: OrderCreateResponseData) => void;
}

/**
 * Inner Stripe Elements Form
 */
function CheckoutForm({
  clientSecret,
  orderNumber,
  totalAmount,
  currency = "CAD",
  onSuccess,
  onClose,
}: {
  clientSecret: string;
  orderNumber: string;
  totalAmount: number;
  currency?: string;
  onSuccess?: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const returnUrl = `${window.location.origin}/dashboard/purchase-history?status=verify&orderNumber=${encodeURIComponent(orderNumber)}`;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setErrorMessage(
        result.error.message || "Payment could not be completed.",
      );
      toast.error(result.error.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      try {
        await orderService.confirmOrder(result.paymentIntent.id);
        toast.success("Payment confirmed successfully!");
        onSuccess?.();
        onClose();
      } catch {
        toast.success("Payment received. Processing your enrollment...");
        onSuccess?.();
        onClose();
      }
    } else {
      toast.info("Payment initiated. Verifying transaction...");
      onSuccess?.();
      onClose();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <PaymentElement />
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#221A7A] px-4 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <HugeiconsIcon
              icon={Loading03Icon}
              size={18}
              className="animate-spin text-white"
            />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <HugeiconsIcon icon={LockKeyIcon} size={18} />
            <span>
              Pay {currency} ${totalAmount.toLocaleString()}
            </span>
          </>
        )}
      </button>
    </form>
  );
}

/**
 * Main Stripe Payment Modal
 * Enforces orders/preview BEFORE calling orders/create
 */
export default function StripePaymentModal({
  isOpen,
  onClose,
  title = "Complete Purchase",
  courses = [],
  memberships = [],
  estimatedAmount = 0,
  onSuccess,
}: StripePaymentModalProps) {
  const [step, setStep] = useState<"preview" | "payment">("preview");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [previewData, setPreviewData] =
    useState<OrderPreviewCalculations | null>(null);
  const [createdOrder, setCreatedOrder] =
    useState<OrderCreateResponseData | null>(null);
  const [stripePromise] = useState(() => getStripe());

  const lastFetchedKey = useRef<string | null>(null);

  const rawAmount =
    estimatedAmount ||
    [...courses, ...memberships].reduce(
      (sum, item) => sum + (Number(item.price) || 0),
      0,
    );

  // Stable string signature of items and amount to avoid infinite loop
  const itemsKey = useMemo(
    () =>
      JSON.stringify({
        c: courses.map((c) => `${c.id}:${c.price}`),
        m: memberships.map((m) => `${m.id}:${m.price}`),
        a: rawAmount,
      }),
    [courses, memberships, rawAmount],
  );

  // Trigger preview calculation only once per open or if items genuinely change
  useEffect(() => {
    if (!isOpen) {
      lastFetchedKey.current = null;
      setStep("preview");
      setPreviewData(null);
      setCreatedOrder(null);
      setIsLoadingPreview(false);
      return;
    }

    if (lastFetchedKey.current === itemsKey) {
      return;
    }
    lastFetchedKey.current = itemsKey;

    let isMounted = true;
    const runPreview = async () => {
      setIsLoadingPreview(true);

      try {
        const res = await orderService.previewOrder({
          amount: rawAmount,
          courses,
          memberships,
        });

        if (!isMounted) return;

        if (res.success && res.data) {
          setPreviewData(res.data);
        } else {
          setPreviewData({
            subAmount: rawAmount,
            total: rawAmount,
            taxAmount: 0,
            currency: "CAD",
          });
        }
      } catch {
        if (!isMounted) return;
        setPreviewData({
          subAmount: rawAmount,
          total: rawAmount,
          taxAmount: 0,
          currency: "CAD",
        });
      } finally {
        if (isMounted) {
          setIsLoadingPreview(false);
        }
      }
    };

    runPreview();

    return () => {
      isMounted = false;
    };
  }, [isOpen, itemsKey, rawAmount, courses, memberships]);

  if (!isOpen) return null;

  const totalCalculated =
    previewData?.total ??
    previewData?.totalAmount ??
    previewData?.amount ??
    rawAmount;

  const handleProceedToPayment = async () => {
    setIsCreatingOrder(true);
    try {
      // Execute preview first, then create order
      const { preview, order } = await orderService.checkoutWithPreview({
        courses,
        memberships,
        estimatedAmount: rawAmount,
      });

      setPreviewData(preview);
      setCreatedOrder(order);

      // If backend returns a direct Stripe Checkout URL, redirect user
      const redirectUrl = order.authorization_url || order.authorizationUrl;
      if (redirectUrl && !order.clientSecret) {
        window.location.href = redirectUrl;
        return;
      }

      // If clientSecret is returned, transition to embedded Stripe payment step
      if (order.clientSecret) {
        setStep("payment");
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.success("Order registered. Processing your enrollment...");
        onSuccess?.(order);
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F0FC] text-[#221A7A]">
              <HugeiconsIcon icon={CreditCardIcon} size={20} />
            </span>
            <h3 className="text-lg font-bold text-[#1D1658]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {step === "preview" ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-gray-600">
              Review your order breakdown before proceeding to secure Stripe
              payment.
            </p>

            {isLoadingPreview ? (
              <div className="space-y-3 py-6 text-center">
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={24}
                  className="mx-auto animate-spin text-[#221A7A]"
                />
                <p className="text-xs text-gray-500">
                  Calculating order totals and taxes...
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 bg-[#F9F8FD] p-4 text-sm">
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ${(previewData?.subAmount ?? rawAmount).toLocaleString()}
                  </span>
                </div>
                {(previewData?.taxAmount !== undefined ||
                  previewData?.taxRate !== undefined) && (
                  <div className="flex justify-between py-1 text-gray-600">
                    <span>
                      Tax / VAT{" "}
                      {previewData?.taxRate ? `(${previewData.taxRate}%)` : ""}:
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${(previewData?.taxAmount ?? 0).toLocaleString()}
                    </span>
                  </div>
                )}
                {Boolean(previewData?.discount) && (
                  <div className="flex justify-between py-1 text-green-600">
                    <span>Discount Applied:</span>
                    <span className="font-semibold">
                      -${previewData?.discount?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-[#1D1658]">
                  <span>Total Due:</span>
                  <span className="text-primary">
                    ${totalCalculated.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      {previewData?.currency || "CAD"}
                    </span>
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={16}
                className="text-green-600"
              />
              <span>
                Preview calculated via live backend taxes before order creation
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoadingPreview || isCreatingOrder}
                onClick={handleProceedToPayment}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#221A7A] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isCreatingOrder ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={18}
                      className="animate-spin text-white"
                    />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : (
                  <span>Proceed to Payment</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          createdOrder?.clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: createdOrder.clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#221A7A",
                  },
                },
              }}
            >
              <CheckoutForm
                clientSecret={createdOrder.clientSecret}
                orderNumber={createdOrder.reference}
                totalAmount={totalCalculated}
                currency={previewData?.currency || "CAD"}
                onSuccess={() => onSuccess?.(createdOrder)}
                onClose={onClose}
              />
            </Elements>
          )
        )}
      </div>
    </div>
  );
}
