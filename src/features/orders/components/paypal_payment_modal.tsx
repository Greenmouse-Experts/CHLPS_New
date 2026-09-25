"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
  LockKeyIcon,
  CreditCardIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { getPayPalClientId, getPayPalCurrency } from "@/lib/paypal";
import { orderService } from "@/features/orders/services/order_service";
import type {
  OrderItemInput,
  OrderPreviewCalculations,
  OrderCreateResponseData,
} from "@/types/orders";

interface PaypalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  courses?: OrderItemInput[];
  memberships?: OrderItemInput[];
  estimatedAmount?: number;
  onSuccess?: (order: OrderCreateResponseData) => void;
}

/**
 * Inner PayPal Buttons Container
 */
function PayPalButtonWrapper({
  totalAmount,
  currency = "CAD",
  courses = [],
  memberships = [],
  rawAmount,
  createdOrder,
  onOrderCreated,
  onSuccess,
  onClose,
}: {
  totalAmount: number;
  currency: string;
  courses: OrderItemInput[];
  memberships: OrderItemInput[];
  rawAmount: number;
  createdOrder: OrderCreateResponseData | null;
  onOrderCreated: (order: OrderCreateResponseData) => void;
  onSuccess?: (order: OrderCreateResponseData) => void;
  onClose: () => void;
}) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const safeTotal = Number(totalAmount.toFixed(2));

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="alert alert-error rounded-2xl p-3 text-sm text-white">
          <span>{errorMessage}</span>
        </div>
      )}

      {isPending ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <HugeiconsIcon
            icon={Loading03Icon}
            size={24}
            className="animate-spin text-primary"
          />
          <p className="text-sm text-base-content/60">
            Connecting to PayPal secure checkout...
          </p>
        </div>
      ) : (
        <div className="relative z-10 w-full min-h-[140px]">
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
              height: 48,
            }}
            disabled={isProcessing}
            createOrder={async (data, actions) => {
              setErrorMessage(null);
              setIsProcessing(true);
              try {
                // Ensure order is created on backend first
                let currentOrder = createdOrder;
                if (!currentOrder) {
                  const res = await orderService.checkoutWithPreview({
                    courses,
                    memberships,
                    estimatedAmount: rawAmount,
                  });
                  currentOrder = res.order;
                  onOrderCreated(currentOrder);
                }

                // If backend provided a PayPal approval redirect URL, redirect directly
                const redirectUrl =
                  currentOrder.authorization_url ||
                  currentOrder.authorizationUrl ||
                  currentOrder.approvalUrl ||
                  currentOrder.approval_url;

                if (redirectUrl) {
                  window.location.href = redirectUrl;
                  return "";
                }

                // If backend provides a paypal order id, return it
                if (currentOrder.paypalOrderId) {
                  return currentOrder.paypalOrderId;
                }

                // Otherwise, create PayPal order on client side
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      reference_id:
                        currentOrder.reference || currentOrder.orderNumber,
                      description: "CHLPS Enrollment & Application",
                      amount: {
                        currency_code: currency.toUpperCase(),
                        value: safeTotal.toString(),
                      },
                    },
                  ],
                });
              } catch (err: any) {
                const msg =
                  err?.message || "Failed to initialize PayPal transaction.";
                setErrorMessage(msg);
                toast.error(msg);
                setIsProcessing(false);
                throw err;
              }
            }}
            onApprove={async (data, actions) => {
              setIsProcessing(true);
              try {
                // Capture order via PayPal actions if available
                if (actions && actions.order) {
                  await actions.order.capture();
                }

                const transactionRef =
                  data.orderID ||
                  createdOrder?.reference ||
                  createdOrder?.orderNumber ||
                  "";

                if (transactionRef) {
                  try {
                    await orderService.confirmOrder(transactionRef);
                  } catch (confirmErr) {
                    console.warn(
                      "Backend payment confirmation notice:",
                      confirmErr,
                    );
                  }
                }

                toast.success("Payment completed successfully with PayPal!");
                if (createdOrder) {
                  onSuccess?.(createdOrder);
                }
                onClose();
              } catch (err: any) {
                const msg =
                  err?.message || "Payment confirmation failed with PayPal.";
                setErrorMessage(msg);
                toast.error(msg);
              } finally {
                setIsProcessing(false);
              }
            }}
            onError={(err: any) => {
              console.error("PayPal checkout error:", err);
              const msg =
                err?.message ||
                "A PayPal communication error occurred. Please try again.";
              setErrorMessage(msg);
              toast.error(msg);
              setIsProcessing(false);
            }}
            onCancel={() => {
              toast.info("PayPal checkout was cancelled.");
              setIsProcessing(false);
            }}
          />
        </div>
      )}

      {/* Manual redirect fallback if backend returned approval URL */}
      {(createdOrder?.authorization_url ||
        createdOrder?.authorizationUrl ||
        createdOrder?.approvalUrl ||
        createdOrder?.approval_url) && (
        <div className="pt-2 text-center">
          <a
            href={
              createdOrder.authorization_url ||
              createdOrder.authorizationUrl ||
              createdOrder.approvalUrl ||
              createdOrder.approval_url
            }
            className="btn btn-outline btn-primary btn-sm rounded-xl text-xs gap-1.5"
          >
            <span>Proceed via PayPal Window</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Main PayPal Payment Modal
 * Enforces orders/preview calculation before placing order and rendering PayPal buttons
 */
export default function PaypalPaymentModal({
  isOpen,
  onClose,
  title = "Complete Purchase",
  courses = [],
  memberships = [],
  estimatedAmount = 0,
  onSuccess,
}: PaypalPaymentModalProps) {
  const [step, setStep] = useState<"preview" | "payment">("preview");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] =
    useState<OrderCreateResponseData | null>(null);

  const hasCourses = Boolean(courses && courses.length > 0);

  // Check course purchase eligibility: only active members can purchase courses
  const eligibilityQuery = useQuery({
    queryKey: ["course-purchase-eligibility"],
    queryFn: async () => {
      const res = await orderService.checkCoursePurchaseEligibility();
      return res.data;
    },
    enabled: isOpen && hasCourses,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const isEligible = !hasCourses || (eligibilityQuery.data?.isEligible ?? true);
  const isCheckingEligibility = hasCourses && eligibilityQuery.isLoading;

  const rawAmount =
    estimatedAmount ||
    [...courses, ...memberships].reduce(
      (sum, item) => sum + (Number(item.price) || 0),
      0,
    );

  // Stable string signature of items and amount for query key caching
  const itemsKey = useMemo(
    () =>
      JSON.stringify({
        c: courses.map((c) => `${c.id}:${c.price}`),
        m: memberships.map((m) => `${m.id}:${m.price}`),
        a: rawAmount,
      }),
    [courses, memberships, rawAmount],
  );

  // TanStack useQuery for order preview calculations
  const previewQuery = useQuery({
    queryKey: ["order-preview", itemsKey],
    queryFn: async () => {
      const res = await orderService.previewOrder({
        amount: rawAmount,
        courses,
        memberships,
      });

      if (res.success && res.data) {
        return res.data;
      }

      return {
        subAmount: rawAmount,
        total: rawAmount,
        taxAmount: 0,
        currency: "CAD",
      } as OrderPreviewCalculations;
    },
    enabled: isOpen && rawAmount > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const previewData = previewQuery.data ?? null;
  const isLoadingPreview = previewQuery.isLoading;

  // Reset modal step when closed
  useEffect(() => {
    if (!isOpen) {
      setStep("preview");
      setCreatedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCalculated =
    previewData?.total ??
    previewData?.totalAmount ??
    previewData?.amount ??
    rawAmount;

  const currency = getPayPalCurrency(previewData?.currency);

  const handleProceedToPayment = async () => {
    if (hasCourses && eligibilityQuery.data && !eligibilityQuery.data.isEligible) {
      toast.error(
        eligibilityQuery.data.message ||
          "An active, unexpired membership is required to purchase courses. Only members can enroll.",
      );
      return;
    }

    setIsCreatingOrder(true);
    try {
      // Execute preview and create order on backend
      const { order } = await orderService.checkoutWithPreview({
        courses,
        memberships,
        estimatedAmount: rawAmount,
      });

      setCreatedOrder(order);

      const redirectUrl =
        order.authorization_url ||
        order.authorizationUrl ||
        order.approvalUrl ||
        order.approval_url;

      // If backend provides a direct PayPal approval redirect URL
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      // Transition to PayPal buttons checkout step
      setStep("payment");
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize PayPal order.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8 border border-base-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
              <HugeiconsIcon icon={CreditCardIcon} size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#0D154B] sm:text-xl">
                {title}
              </h3>
              <p className="text-xs text-base-content/60">
                Official CHLPS PayPal Checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-base-content/60 hover:bg-base-200 hover:text-base-content transition"
            aria-label="Close dialog"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {hasCourses && eligibilityQuery.data && !eligibilityQuery.data.isEligible ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <HugeiconsIcon icon={LockKeyIcon} size={28} />
              </div>
              <h4 className="mt-3 text-base font-bold text-[#0D154B] sm:text-lg">
                Active Membership Required
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-base-content/75 leading-relaxed max-w-sm mx-auto">
                {eligibilityQuery.data.message ||
                  "Only active CHLPS members can enroll in and purchase certification courses. An active, unexpired membership is required."}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/membership"
                onClick={onClose}
                className="btn btn-primary btn-md w-full rounded-2xl text-sm font-bold text-white normal-case shadow-sm gap-2 flex items-center justify-center"
              >
                <span>Explore Memberships</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/60 hover:text-base-content"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : step === "preview" ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-base-content/70">
              Review your order breakdown before proceeding to secure PayPal
              payment.
            </p>

            {isLoadingPreview ? (
              <div className="space-y-3 py-8 text-center">
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={26}
                  className="mx-auto animate-spin text-primary"
                />
                <p className="text-sm text-base-content/60">
                  Calculating order totals and taxes...
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-base-200 bg-base-50 p-4">
                <div className="flex justify-between py-1.5 text-sm text-base-content/70">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-base-content">
                    ${(previewData?.subAmount ?? rawAmount).toLocaleString()}
                  </span>
                </div>

                {(previewData?.taxAmount !== undefined ||
                  previewData?.taxRate !== undefined) && (
                  <div className="flex justify-between py-1.5 text-sm text-base-content/70">
                    <span>
                      Tax / VAT{" "}
                      {previewData?.taxRate ? `(${previewData.taxRate}%)` : ""}:
                    </span>
                    <span className="font-semibold text-base-content">
                      ${(previewData?.taxAmount ?? 0).toLocaleString()}
                    </span>
                  </div>
                )}

                {Boolean(previewData?.discount) && (
                  <div className="flex justify-between py-1.5 text-sm text-emerald-600">
                    <span>Discount Applied:</span>
                    <span className="font-semibold">
                      -${previewData?.discount?.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="mt-3 flex justify-between border-t border-base-200 pt-3 text-base font-bold text-[#0D154B]">
                  <span>Total Due:</span>
                  <span className="text-primary text-lg">
                    ${totalCalculated.toLocaleString()}{" "}
                    <span className="text-xs font-semibold text-base-content/60">
                      {currency}
                    </span>
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={16}
                className="text-emerald-500 shrink-0"
              />
              <span>
                Protected with PayPal Buyer Protection & end-to-end encryption.
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-md flex-1 rounded-2xl text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoadingPreview || isCreatingOrder}
                onClick={handleProceedToPayment}
                className="btn btn-primary btn-md flex-1 rounded-2xl text-sm font-bold text-white normal-case shadow-sm gap-2"
              >
                {isCreatingOrder ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={18}
                      className="animate-spin"
                    />
                    <span>Connecting to PayPal...</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={LockKeyIcon} size={16} />
                    <span>Pay with PayPal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-base-200 bg-base-50 p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-base-content/70">Order Total:</span>
                <span className="font-bold text-primary text-base">
                  ${totalCalculated.toLocaleString()} {currency}
                </span>
              </div>
              {createdOrder?.orderNumber && (
                <div className="mt-1 flex justify-between items-center text-xs text-base-content/60">
                  <span>Order Reference:</span>
                  <span className="font-mono">{createdOrder.orderNumber}</span>
                </div>
              )}
            </div>

            <PayPalScriptProvider
              options={{
                clientId: getPayPalClientId(),
                currency: currency.toUpperCase(),
                intent: "capture",
                components: "buttons",
              }}
            >
              <PayPalButtonWrapper
                totalAmount={totalCalculated}
                currency={currency}
                courses={courses}
                memberships={memberships}
                rawAmount={rawAmount}
                createdOrder={createdOrder}
                onOrderCreated={setCreatedOrder}
                onSuccess={onSuccess}
                onClose={onClose}
              />
            </PayPalScriptProvider>

            <button
              type="button"
              onClick={() => setStep("preview")}
              className="btn btn-ghost btn-sm w-full rounded-xl text-xs text-base-content/60 hover:text-base-content"
            >
              Back to Order Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
