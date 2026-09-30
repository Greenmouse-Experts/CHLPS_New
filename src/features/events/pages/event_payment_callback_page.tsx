"use client";

import { useEffect, useState, Suspense } from "react";
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
  Calendar03Icon,
  Ticket02Icon,
  Invoice01Icon,
  ReloadIcon,
} from "@hugeicons/core-free-icons";
import { eventRegistrationService } from "@/features/events/services/event_registration_service";
import { orderService } from "@/features/orders/services/order_service";
import { Assets } from "@/lib/assets";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";

type CallbackStatus = "verifying" | "success" | "failed" | "cancelled";

interface RegistrationDetails {
  ticketNumber?: string;
  reference?: string;
  eventTitle?: string;
  status?: string;
  meetingLink?: string;
  amount?: number;
  currency?: string;
  [key: string]: any;
}

function EventPaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Extract reference, token, payerId from query parameters
  const reference = searchParams.get("reference") || "";
  const token = searchParams.get("token") || "";
  const payerId =
    searchParams.get("PayerID") || searchParams.get("payerId") || "";
  const thirdPartyRefParam = searchParams.get("thirdPartyRef") || "";
  const eventId = searchParams.get("eventId") || "";
  const statusParam = (
    searchParams.get("status") ||
    searchParams.get("redirect_status") ||
    searchParams.get("payment") ||
    ""
  ).toLowerCase();

  // Determine the primary reference identifier for confirmation
  const primaryRef = reference || thirdPartyRefParam || token;

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

  const [registrationData, setRegistrationData] =
    useState<RegistrationDetails | null>(null);
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

    if (!primaryRef && !token) {
      if (statusParam === "success") {
        setStatus("success");
        return;
      }
      setStatus("failed");
      setErrorMessage(
        "No event transaction reference was provided in the return URL.",
      );
      return;
    }

    let isMounted = true;

    async function confirmEvent() {
      setStatus("verifying");
      setErrorMessage("");

      const payload = {
        token: token || undefined,
        payerId: payerId || undefined,
        reference: reference || undefined,
        thirdPartyRef: primaryRef,
      };

      try {
        // 1. Try confirming with primaryRef on eventRegistrationService
        let res = await eventRegistrationService.confirmEventPayment(
          primaryRef,
          payload,
        );

        // 2. If reference failed and token is different, try with token
        if (!res.success && token && token !== primaryRef) {
          res = await eventRegistrationService.confirmEventPayment(
            token,
            payload,
          );
        }

        // 3. If event confirmation failed, fallback to standard orders confirm
        if (!res.success) {
          const orderRes = await orderService.confirmOrder(primaryRef);
          if (orderRes.success && orderRes.data) {
            if (isMounted) {
              setStatus("success");
              setRegistrationData({
                reference: orderRes.data.reference || primaryRef,
                ticketNumber:
                  (orderRes.data as any).ticketNumber ||
                  `TK-${primaryRef.slice(0, 8).toUpperCase()}`,
                status: "success",
              });
              queryClient.invalidateQueries({
                queryKey: ["my-event-registrations"],
              });
              queryClient.invalidateQueries({
                queryKey: ["events"],
              });
            }
            return;
          }
        }

        if (res.success && res.data) {
          if (isMounted) {
            setStatus("success");
            const data = res.data;
            setRegistrationData({
              ticketNumber:
                data.ticketNumber ||
                data.ticket ||
                data.registration?.ticketNumber ||
                `TK-${primaryRef.slice(0, 8).toUpperCase()}`,
              reference: data.reference || primaryRef,
              eventTitle:
                data.event?.title ||
                data.registration?.event?.title ||
                data.title ||
                "",
              status: data.status || "confirmed",
              meetingLink:
                data.meetingLink ||
                data.event?.meetingLink ||
                data.registration?.meetingLink,
              amount: data.amount,
              currency: data.currency || "CAD",
            });

            // Invalidate queries so dashboard & events pages refresh
            queryClient.invalidateQueries({
              queryKey: ["my-event-registrations"],
            });
            queryClient.invalidateQueries({
              queryKey: ["events"],
            });
            queryClient.invalidateQueries({
              queryKey: ["purchase-history"],
            });
          }
        } else {
          if (isMounted) {
            setStatus("failed");
            setErrorMessage(
              res.message ||
                "Payment verification could not be completed. Your account may not have been debited.",
            );
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("failed");
          setErrorMessage(
            err?.message ||
              "An unexpected network error occurred while verifying your event registration.",
          );
        }
      }
    }

    confirmEvent();

    return () => {
      isMounted = false;
    };
  }, [primaryRef, token, payerId, reference, statusParam, attemptCount, queryClient]);

  const handleRetry = () => {
    setAttemptCount((c) => c + 1);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#0B0E33] via-[#0D154B] to-[#080B26] text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto w-full">
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
                    Verifying Event Registration
                  </h2>
                  <p className="text-sm text-base-content/70 max-w-sm mx-auto leading-relaxed">
                    Please hold on while we securely confirm your payment with
                    PayPal and generate your event access ticket...
                  </p>
                </div>

                {primaryRef && (
                  <div className="rounded-2xl bg-base-200/50 p-3 text-xs text-base-content/60 font-mono inline-block max-w-full truncate px-4">
                    Reference: {primaryRef}
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
                    Registration Confirmed
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                    You're Going!
                  </h2>
                  <p className="text-sm text-base-content/75 max-w-md mx-auto leading-relaxed">
                    Thank you for registering. Your payment has been confirmed
                    and your attendance ticket has been officially issued.
                  </p>
                </div>

                {/* Event Registration Details Box */}
                <div className="rounded-2xl border border-base-200 bg-base-50/80 p-5 text-left space-y-3">
                  {registrationData?.ticketNumber && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-base-content/60">Ticket Number</span>
                      <span className="font-mono font-bold text-base-content bg-base-200/80 px-2.5 py-1 rounded-lg">
                        {registrationData.ticketNumber}
                      </span>
                    </div>
                  )}

                  {registrationData?.eventTitle && (
                    <div className="flex justify-between items-center text-xs border-t border-base-200 pt-2.5">
                      <span className="text-base-content/60">Event</span>
                      <span className="font-semibold text-base-content text-right max-w-[240px] truncate">
                        {registrationData.eventTitle}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs border-t border-base-200 pt-2.5">
                    <span className="text-base-content/60">Status</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Confirmed & Paid
                    </span>
                  </div>

                  {primaryRef && (
                    <div className="flex justify-between items-center text-xs border-t border-base-200 pt-2.5">
                      <span className="text-base-content/60">
                        Transaction Ref
                      </span>
                      <span className="font-mono text-base-content/80 max-w-[200px] truncate">
                        {primaryRef}
                      </span>
                    </div>
                  )}

                  {registrationData?.meetingLink && (
                    <div className="rounded-xl bg-[#0D154B]/5 border border-[#0D154B]/10 p-3 mt-2 text-xs space-y-1">
                      <span className="font-semibold text-[#0D154B] block">
                        Virtual Meeting Access
                      </span>
                      <a
                        href={registrationData.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all block font-mono text-[11px]"
                      >
                        {registrationData.meetingLink}
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/dashboard/events"
                    className="btn btn-primary btn-block h-13 min-h-13 rounded-2xl text-sm font-bold text-white normal-case shadow-md gap-2 flex items-center justify-center"
                  >
                    <HugeiconsIcon icon={Ticket02Icon} size={18} />
                    <span>View My Event Registrations</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                  </Link>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/events"
                      className="btn btn-outline btn-md rounded-2xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white gap-1.5"
                    >
                      <HugeiconsIcon icon={Calendar03Icon} size={16} />
                      <span>Browse Events</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      className="btn btn-outline btn-md rounded-2xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white gap-1.5"
                    >
                      <HugeiconsIcon icon={Invoice01Icon} size={16} />
                      <span>Dashboard</span>
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
                    Registration Incomplete
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                    Checkout Cancelled
                  </h2>
                  <p className="text-sm text-base-content/70 max-w-sm mx-auto leading-relaxed">
                    You cancelled the registration payment before completing checkout.
                    No ticket was issued and no funds were deducted.
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
                    href="/events"
                    className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/60 hover:text-base-content block"
                  >
                    Back to All Events
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
                    Verification Incomplete
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                    Payment Verification Failed
                  </h2>
                  <p className="text-sm text-base-content/70 max-w-md mx-auto leading-relaxed">
                    {errorMessage ||
                      "We were unable to verify this event registration with PayPal."}
                  </p>
                </div>

                {primaryRef && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-900 font-mono break-all text-left">
                    Reference: {primaryRef}
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
                      href="/contact-us"
                      className="btn btn-outline btn-md rounded-2xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
                    >
                      Contact Support
                    </Link>
                    <Link
                      href="/events"
                      className="btn btn-ghost btn-md rounded-2xl normal-case text-xs font-semibold text-base-content/70 hover:text-base-content"
                    >
                      Back to Events
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function EventPaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0E33] flex items-center justify-center">
          <div className="text-center space-y-4 text-white">
            <span className="loading loading-spinner loading-lg text-[#C99E4A]" />
            <p className="text-sm font-medium text-white/70">
              Loading event registration confirmation...
            </p>
          </div>
        </div>
      }
    >
      <EventPaymentCallbackContent />
    </Suspense>
  );
}
