"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  ComputerIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { getPayPalClientId, getPayPalCurrency } from "@/lib/paypal";
import {
  eventRegistrationService,
  type EventRegistrationPaymentResult,
} from "../services/event_registration_service";
import type { ChlpsEvent } from "../events_data";

interface EventPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ChlpsEvent;
  onSuccess?: (ticketRef?: string) => void;
}

/**
 * Inner PayPal Buttons for Event Ticket Checkout
 */
function EventPayPalButtons({
  event,
  paymentData,
  numericAmount,
  currency = "CAD",
  onPaymentSuccess,
  onClose,
}: {
  event: ChlpsEvent;
  paymentData: EventRegistrationPaymentResult;
  numericAmount: number;
  currency: string;
  onPaymentSuccess: (ticketRef: string) => void;
  onClose: () => void;
}) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const eventId = event.raw?.id || event.id;
  const ticketRef =
    paymentData.ticketNumber ||
    paymentData.reference ||
    `TK-${eventId.slice(0, 6).toUpperCase()}`;

  const safeAmount = Number(numericAmount.toFixed(2));

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

              // If backend provides a direct PayPal approval redirect URL
              const redirectUrl =
                paymentData.authorization_url ||
                paymentData.authorizationUrl ||
                paymentData.approvalUrl ||
                paymentData.approval_url;

              if (redirectUrl) {
                window.location.href = redirectUrl;
                return "";
              }

              if (paymentData.paypalOrderId) {
                return paymentData.paypalOrderId;
              }

              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    reference_id: ticketRef,
                    description: `Event Ticket: ${event.title}`,
                    amount: {
                      currency_code: currency.toUpperCase(),
                      value: safeAmount.toString(),
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              setIsProcessing(true);
              try {
                if (actions && actions.order) {
                  await actions.order.capture();
                }

                const transactionRef =
                  data.orderID || paymentData.reference || ticketRef;

                try {
                  await eventRegistrationService.confirmEventPayment(
                    transactionRef,
                  );
                } catch (confirmErr) {
                  console.warn(
                    "Backend payment verification notice:",
                    confirmErr,
                  );
                }

                toast.success(
                  "Payment confirmed! Your ticket has been issued.",
                );
                onPaymentSuccess(ticketRef);
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
              console.error("PayPal ticket error:", err);
              const msg =
                err?.message ||
                "A PayPal communication error occurred. Please try again.";
              setErrorMessage(msg);
              toast.error(msg);
              setIsProcessing(false);
            }}
            onCancel={() => {
              toast.info("PayPal ticket checkout was cancelled.");
              setIsProcessing(false);
            }}
          />
        </div>
      )}

      {/* Fallback button if backend returned PayPal approval URL */}
      {(paymentData.authorization_url ||
        paymentData.authorizationUrl ||
        paymentData.approvalUrl ||
        paymentData.approval_url) && (
        <div className="pt-2 text-center">
          <a
            href={
              paymentData.authorization_url ||
              paymentData.authorizationUrl ||
              paymentData.approvalUrl ||
              paymentData.approval_url
            }
            className="btn btn-outline btn-primary btn-sm rounded-xl text-xs gap-1.5"
          >
            <span>Complete via PayPal Page</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Main Event Payment & Ticket Purchase Modal
 * Exclusively powered by PayPal
 */
export default function EventPaymentModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: EventPaymentModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<"preview" | "paypal" | "confirmed">(
    "preview",
  );
  const [isInitiating, setIsInitiating] = useState(false);
  const [paymentData, setPaymentData] =
    useState<EventRegistrationPaymentResult | null>(null);
  const [confirmedTicketNumber, setConfirmedTicketNumber] =
    useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setStep("preview");
      setIsInitiating(false);
      setPaymentData(null);
      setConfirmedTicketNumber("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const eventId = event.raw?.id || event.id;
  const isVirtual =
    event.location && event.location.trim().toLowerCase() === "online";

  // Parse raw price or strip currency symbols
  const numericPrice = (() => {
    if (typeof event.ticketPrice === "number") return event.ticketPrice;
    const cleaned = String(event.ticketPrice || "").replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 50 : parsed;
  })();

  const currency = getPayPalCurrency();

  const handleProceedToPayment = async () => {
    setIsInitiating(true);
    try {
      const returnUrl = `${window.location.origin}/events/${eventId}?payment=success`;
      const res = await eventRegistrationService.registerPaidEvent(
        eventId,
        returnUrl,
      );

      if (!res.success || !res.data) {
        throw new Error(
          res.message || "Failed to initiate ticket registration.",
        );
      }

      const data = res.data;
      setPaymentData(data);

      const redirectUrl =
        data.authorization_url ||
        data.authorizationUrl ||
        data.approvalUrl ||
        data.approval_url;

      // If backend provides an external checkout redirect URL directly
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      setStep("paypal");
    } catch (err: any) {
      toast.error(err.message || "Failed to start PayPal checkout.");
    } finally {
      setIsInitiating(false);
    }
  };

  const handlePaymentSuccess = (ticketRef: string) => {
    setConfirmedTicketNumber(
      ticketRef || `TK-${eventId.slice(0, 6).toUpperCase()}`,
    );
    setStep("confirmed");
    onSuccess?.(ticketRef);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8 border border-base-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <HugeiconsIcon icon={CreditCardIcon} size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#0D154B] sm:text-xl">
                {step === "confirmed"
                  ? "Ticket Confirmed"
                  : "PayPal Ticket Checkout"}
              </h3>
              <p className="text-xs text-base-content/60">
                Association of Chartered Loss Prevention Specialists
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

        {/* STEP 1: PREVIEW */}
        {step === "preview" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-base-200 bg-base-50 p-4 space-y-3">
              <span className="badge badge-primary badge-outline text-xs font-semibold px-2.5 py-1">
                {event.category}
              </span>
              <h4 className="text-base font-bold text-[#0D154B] leading-snug">
                {event.title}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-base-200/80 text-xs text-base-content/70">
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={14}
                    className="text-primary shrink-0"
                  />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={14}
                    className="text-primary shrink-0"
                  />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:col-span-2">
                  <HugeiconsIcon
                    icon={isVirtual ? ComputerIcon : Location01Icon}
                    size={14}
                    className="text-primary shrink-0"
                  />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-base-200 bg-[#F9F8FE] p-4">
              <div className="flex justify-between items-center text-sm text-base-content/70">
                <span>Standard Ticket Access:</span>
                <span className="font-semibold text-base-content">
                  ${numericPrice.toLocaleString()} {currency}
                </span>
              </div>
              <div className="mt-2.5 flex justify-between items-center border-t border-base-200/80 pt-2.5">
                <span className="text-sm font-bold text-[#0D154B]">
                  Total Payment:
                </span>
                <span className="text-lg font-extrabold text-primary">
                  ${numericPrice.toLocaleString()} {currency}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={16}
                className="text-emerald-500 shrink-0"
              />
              <span>
                Instant electronic ticket pass upon completing PayPal payment.
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-md flex-1 rounded-2xl text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={isInitiating}
                className="btn btn-primary btn-md flex-1 rounded-2xl text-sm font-bold text-white normal-case shadow-sm gap-2"
              >
                {isInitiating ? (
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
                    <span>Proceed to PayPal</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PAYPAL CHECKOUT */}
        {step === "paypal" && paymentData && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-base-200 bg-base-50 p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-base-content/70">Ticket:</span>
                <span className="font-bold text-primary text-base">
                  ${numericPrice.toLocaleString()} {currency}
                </span>
              </div>
              <p className="mt-1 text-xs text-base-content/60 truncate">
                {event.title}
              </p>
            </div>

            <PayPalScriptProvider
              options={{
                clientId: getPayPalClientId(),
                currency: currency.toUpperCase(),
                intent: "capture",
                components: "buttons",
              }}
            >
              <EventPayPalButtons
                event={event}
                paymentData={paymentData}
                numericAmount={numericPrice}
                currency={currency}
                onPaymentSuccess={handlePaymentSuccess}
                onClose={onClose}
              />
            </PayPalScriptProvider>

            <button
              type="button"
              onClick={() => setStep("preview")}
              className="btn btn-ghost btn-sm w-full rounded-xl text-xs text-base-content/60 hover:text-base-content"
            >
              Back to Ticket Summary
            </button>
          </div>
        )}

        {/* STEP 3: CONFIRMED */}
        {step === "confirmed" && (
          <div className="mt-6 space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={36} />
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#0D154B] sm:text-xl">
                Registration Confirmed!
              </h4>
              <p className="mt-1 text-sm text-base-content/70">
                You are registered for <strong>{event.title}</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
              <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold">
                Ticket Reference
              </span>
              <p className="mt-1 font-mono text-base font-extrabold text-emerald-900 tracking-wide">
                {confirmedTicketNumber ||
                  paymentData?.ticketNumber ||
                  `TK-${eventId.slice(0, 6).toUpperCase()}`}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/dashboard/membership");
                }}
                className="btn btn-primary btn-md w-full rounded-2xl text-sm font-bold text-white normal-case shadow-sm"
              >
                Go to Student Dashboard
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-sm text-xs font-semibold text-base-content/70"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
