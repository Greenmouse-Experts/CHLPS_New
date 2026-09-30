"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Loading03Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  ShieldCheckIcon,
  BookOpen01Icon,
  Invoice01Icon,
  ReloadIcon,
} from "@hugeicons/core-free-icons";
import { orderService } from "@/features/orders/services/order_service";
import { eventRegistrationService } from "@/features/events/services/event_registration_service";
import { Assets } from "@/lib/assets";
import type { OrderConfirmResponseData } from "@/types/orders";

type CallbackStatus = "verifying" | "success" | "failed" | "cancelled";

interface OrderCallbackProps {
  routeRef?: string;
}

function OrderCallbackContent({ routeRef }: OrderCallbackProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Extract reference from route parameter or various gateway query param aliases
  const thirdPartyRef =
    routeRef ||
    searchParams.get("thirdPartyRef") ||
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    searchParams.get("token") ||
    searchParams.get("orderID") ||
    searchParams.get("orderId") ||
    searchParams.get("session_id") ||
    searchParams.get("payment_intent") ||
    searchParams.get("paymentId") ||
    searchParams.get("id") ||
    "";

  const typeParam = searchParams.get("type") || "";
  const eventIdParam = searchParams.get("eventId") || "";
  const statusParam = (
    searchParams.get("status") ||
    searchParams.get("redirect_status") ||
    searchParams.get("payment") ||
    ""
  ).toLowerCase();

  const [status, setStatus] = useState<CallbackStatus>(() => {
    if (
      statusParam === "cancel" ||
      statusParam === "cancelled" ||
      statusParam === "canceled"
    ) {
      return "cancelled";
    }
    if (statusParam === "failed") {
      return "failed";
    }
    return "verifying";
  });

  const [confirmationData, setConfirmationData] =
    useState<OrderConfirmResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    // If user cancelled, don't attempt server verification
    if (
      statusParam === "cancel" ||
      statusParam === "cancelled" ||
      statusParam === "canceled"
    ) {
      setStatus("cancelled");
      return;
    }

    if (!thirdPartyRef) {
      // If payment is flagged as success without reference
      if (statusParam === "success") {
        setStatus("success");
        return;
      }
      setStatus("failed");
      setErrorMessage(
        "No payment reference was provided in the return URL. Please check your purchase history or contact support.",
      );
      return;
    }

    let isMounted = true;

    async function verifyPayment() {
      setStatus("verifying");
      setErrorMessage("");

      try {
        // If type is explicitly event or has eventId, try event confirmation
        if (typeParam === "event" || eventIdParam) {
          const eventRes =
            await eventRegistrationService.confirmEventPayment(thirdPartyRef);
          if (eventRes.success) {
            if (isMounted) {
              setStatus("success");
              setConfirmationData({
                reference: thirdPartyRef,
                status: "success",
                message: eventRes.message || "Event registration confirmed!",
              });
              queryClient.invalidateQueries({
                queryKey: ["my-event-registrations"],
              });
            }
            return;
          }
        }

        // Standard Order Confirmation (POST /orders/confirm/:thirdPartyRef)
        const orderRes = await orderService.confirmOrder(thirdPartyRef);

        if (orderRes.success && orderRes.data) {
          if (isMounted) {
            setStatus("success");
            setConfirmationData(orderRes.data);

            // Invalidate relevant student caches to refresh dashboard state
            queryClient.invalidateQueries({
              queryKey: ["user-enrolled-memberships"],
            });
            queryClient.invalidateQueries({
              queryKey: ["user-membership-applications"],
            });
            queryClient.invalidateQueries({
              queryKey: ["purchased-courses"],
            });
            queryClient.invalidateQueries({
              queryKey: ["purchase-history"],
            });
            queryClient.invalidateQueries({
              queryKey: ["orders"],
            });
            queryClient.invalidateQueries({
              queryKey: ["user-membership"],
            });
          }
        } else {
          // If orders/confirm returned an error, check if it was an event registration fallback
          if (typeParam !== "order") {
            try {
              const eventRes =
                await eventRegistrationService.confirmEventPayment(
                  thirdPartyRef,
                );
              if (eventRes.success) {
                if (isMounted) {
                  setStatus("success");
                  setConfirmationData({
                    reference: thirdPartyRef,
                    status: "success",
                    message:
                      eventRes.message || "Event registration confirmed!",
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["my-event-registrations"],
                  });
                }
                return;
              }
            } catch {
              // Ignore and proceed to show standard error
            }
          }

          if (isMounted) {
            setStatus("failed");
            setErrorMessage(
              orderRes.message ||
                "Payment verification could not be completed. Your bank or PayPal account may not have been debited.",
            );
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("failed");
          setErrorMessage(
            err?.message ||
              "An unexpected network error occurred while confirming your transaction.",
          );
        }
      }
    }

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [
    thirdPartyRef,
    statusParam,
    typeParam,
    eventIdParam,
    attemptCount,
    queryClient,
  ]);

  const handleRetry = () => {
    setAttemptCount((c) => c + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E33] via-[#0D154B] to-[#080B26] text-white flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white p-1.5 shadow-md">
            <Image
              src={Assets.icons.logo}
              alt="CHLPS Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-base font-bold tracking-tight text-white group-hover:text-[#C99E4A] transition">
            CHLPS Canada
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1 transition"
        >
          <span>Dashboard</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Link>
      </div>

      {/* Main Status Container */}
      <div className="max-w-xl mx-auto w-full my-auto">
        <div className="rounded-[32px] border border-white/10 bg-white/95 text-[#0D154B] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* ========================================================================= */}
          {/* 1. VERIFYING STATE                                                        */}
          {/* ========================================================================= */}
          {status === "verifying" && (
            <div className="text-center py-6 sm:py-8 space-y-6">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0D154B]/5 border border-[#0D154B]/10">
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={36}
                  className="animate-spin text-[#0D154B]"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                  Verifying Payment
                </h2>
                <p className="text-sm text-base-content/70 max-w-sm mx-auto leading-relaxed">
                  Please hold on while we securely verify your transaction with
                  the payment processor and unlock your access...
                </p>
              </div>

              {thirdPartyRef && (
                <div className="rounded-2xl bg-base-200/50 p-3 text-xs text-base-content/60 font-mono inline-block max-w-full truncate px-4">
                  Reference: {thirdPartyRef}
                </div>
              )}

              <div className="pt-2">
                <div className="flex justify-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0D154B] animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-[#0D154B] animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-[#0D154B] animate-bounce" />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. SUCCESS STATE                                                          */}
          {/* ========================================================================= */}
          {status === "success" && (
            <div className="text-center py-4 space-y-6">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-inner">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={42}
                  strokeWidth={2.2}
                />
              </div>

              <div className="space-y-2">
                <span className="badge badge-success text-white px-3 py-1 text-xs font-semibold">
                  Payment Verified
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                  Enrollment Confirmed!
                </h2>
                <p className="text-sm text-base-content/75 max-w-md mx-auto leading-relaxed">
                  Thank you for your payment! Your transaction was successfully
                  processed and verified. Your course materials and membership
                  privileges are now activated.
                </p>
              </div>

              {/* Transaction Metadata Card */}
              <div className="rounded-2xl border border-base-200 bg-base-50/80 p-4 text-left space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-base-content/60">Status</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Confirmed & Active
                  </span>
                </div>

                {(confirmationData?.orderNumber ||
                  confirmationData?.reference ||
                  thirdPartyRef) && (
                  <div className="flex justify-between items-center text-xs border-t border-base-200 pt-2">
                    <span className="text-base-content/60">
                      Transaction Reference
                    </span>
                    <span className="font-mono font-semibold text-base-content max-w-[200px] truncate">
                      {confirmationData?.orderNumber ||
                        confirmationData?.reference ||
                        thirdPartyRef}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs border-t border-base-200 pt-2">
                  <span className="text-base-content/60">Confirmed At</span>
                  <span className="font-medium text-base-content">
                    {new Date().toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/dashboard/courses"
                  className="btn btn-primary btn-block h-13 min-h-13 rounded-2xl text-sm font-bold text-white normal-case shadow-md gap-2 flex items-center justify-center"
                >
                  <HugeiconsIcon icon={BookOpen01Icon} size={18} />
                  <span>Go to My Learning Hub</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/dashboard/membership"
                    className="btn btn-outline btn-md rounded-2xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white gap-1.5"
                  >
                    <HugeiconsIcon icon={ShieldCheckIcon} size={16} />
                    <span>My Memberships</span>
                  </Link>

                  <Link
                    href="/dashboard/purchase-history"
                    className="btn btn-outline btn-md rounded-2xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white gap-1.5"
                  >
                    <HugeiconsIcon icon={Invoice01Icon} size={16} />
                    <span>View Receipt</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CANCELLED STATE                                                        */}
          {/* ========================================================================= */}
          {status === "cancelled" && (
            <div className="text-center py-4 space-y-6">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-200">
                <HugeiconsIcon icon={Cancel01Icon} size={38} strokeWidth={2} />
              </div>

              <div className="space-y-2">
                <span className="badge badge-warning text-amber-950 px-3 py-1 text-xs font-semibold">
                  Checkout Cancelled
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                  Payment Was Cancelled
                </h2>
                <p className="text-sm text-base-content/70 max-w-sm mx-auto leading-relaxed">
                  You cancelled the checkout session before completing payment.
                  No funds were deducted from your account.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-primary btn-block h-13 min-h-13 rounded-2xl text-sm font-bold text-white normal-case shadow-md gap-2 flex items-center justify-center"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                  <span>Return to Previous Page</span>
                </button>

                <Link
                  href="/dashboard"
                  className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/60 hover:text-base-content block"
                >
                  Go to Student Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. FAILED STATE                                                           */}
          {/* ========================================================================= */}
          {status === "failed" && (
            <div className="text-center py-4 space-y-6">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-200">
                <HugeiconsIcon icon={Cancel01Icon} size={38} strokeWidth={2} />
              </div>

              <div className="space-y-2">
                <span className="badge badge-error text-white px-3 py-1 text-xs font-semibold">
                  Verification Issue
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                  Payment Verification Incomplete
                </h2>
                <p className="text-sm text-base-content/70 max-w-md mx-auto leading-relaxed">
                  {errorMessage ||
                    "We were unable to verify this transaction reference with the payment processor."}
                </p>
              </div>

              {thirdPartyRef && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-900 font-mono break-all text-left">
                  Reference: {thirdPartyRef}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn btn-primary btn-block h-13 min-h-13 rounded-2xl text-sm font-bold text-white normal-case shadow-md gap-2 flex items-center justify-center"
                >
                  <HugeiconsIcon icon={ReloadIcon} size={18} />
                  <span>Retry Verification</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/dashboard/support"
                    className="btn btn-outline btn-md rounded-2xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn btn-ghost btn-md rounded-2xl normal-case text-xs font-semibold text-base-content/70 hover:text-base-content"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center pt-6 text-xs text-white/50">
        &copy; {new Date().getFullYear()} Chartered Loss Prevention Specialists
        Canada (CHLPS). All rights reserved.
      </div>
    </div>
  );
}

export default function OrderCallbackPage({ routeRef }: OrderCallbackProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0E33] flex items-center justify-center">
          <div className="text-center space-y-4 text-white">
            <span className="loading loading-spinner loading-lg text-[#C99E4A]" />
            <p className="text-sm font-medium text-white/70">
              Loading payment confirmation...
            </p>
          </div>
        </div>
      }
    >
      <OrderCallbackContent routeRef={routeRef} />
    </Suspense>
  );
}
