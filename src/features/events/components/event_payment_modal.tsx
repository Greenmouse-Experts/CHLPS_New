"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  ComputerIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { getStripe } from "@/lib/stripe";
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
 * Inner Stripe Elements Form for Event Ticket
 */
function EventStripeForm({
  clientSecret,
  ticketRef,
  event,
  onSuccess,
  onClose,
}: {
  clientSecret: string;
  ticketRef: string;
  event: ChlpsEvent;
  onSuccess?: (ref: string) => void;
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

    const eventId = event.raw?.id || event.id;
    const returnUrl = `${window.location.origin}/events/${eventId}?payment=success&ref=${encodeURIComponent(ticketRef)}`;

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
        await eventRegistrationService.confirmEventPayment(
          result.paymentIntent.id,
        );
        toast.success("Payment confirmed! Your ticket has been issued.");
        onSuccess?.(ticketRef);
      } catch {
        toast.success("Payment received. Confirming your event registration...");
        onSuccess?.(ticketRef);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="alert alert-error rounded-xl p-3 text-sm text-white">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="rounded-xl border border-base-200 bg-base-50 p-4">
        <PaymentElement />
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="btn btn-primary btn-md rounded-xl text-sm font-bold text-white normal-case shadow-sm gap-2"
        >
          {isProcessing ? (
            <>
              <HugeiconsIcon
                icon={Loading03Icon}
                size={18}
                className="animate-spin"
              />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={LockKeyIcon} size={16} />
              <span>Confirm & Pay {event.ticketPrice}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/**
 * Main Event Payment & Ticket Purchase Modal
 */
export default function EventPaymentModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: EventPaymentModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<"preview" | "stripe" | "confirmed">("preview");
  const [isInitiating, setIsInitiating] = useState(false);
  const [paymentData, setPaymentData] =
    useState<EventRegistrationPaymentResult | null>(null);
  const [confirmedTicketNumber, setConfirmedTicketNumber] = useState<string>("");
  const [stripePromise] = useState(() => getStripe());

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

  const handleProceedToPayment = async () => {
    setIsInitiating(true);
    try {
      const returnUrl = `${window.location.origin}/events/${eventId}?payment=success`;
      const res = await eventRegistrationService.registerPaidEvent(
        eventId,
        returnUrl,
      );

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to initiate ticket registration.");
      }

      const data = res.data;
      setPaymentData(data);

      const redirectUrl = data.authorization_url || data.authorizationUrl;

      // If backend provides an external checkout URL (Stripe Checkout / Paystack), redirect
      if (redirectUrl && !data.clientSecret) {
        window.location.href = redirectUrl;
        return;
      }

      // If clientSecret is returned, transition to embedded Stripe form
      if (data.clientSecret) {
        setStep("stripe");
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        // Direct confirmation if no payment required / instant registration
        const ticketNum =
          data.ticketNumber ||
          data.reference ||
          `TK-${eventId.slice(0, 6).toUpperCase()}`;
        setConfirmedTicketNumber(ticketNum);
        setStep("confirmed");
        toast.success("Event registration successful!");
        onSuccess?.(ticketNum);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start payment process.");
    } finally {
      setIsInitiating(false);
    }
  };

  const handlePaymentSuccess = (ticketRef: string) => {
    setConfirmedTicketNumber(ticketRef || `TK-${eventId.slice(0, 6).toUpperCase()}`);
    setStep("confirmed");
    onSuccess?.(ticketRef);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8 border border-base-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={CreditCardIcon} size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#0D154B] sm:text-xl">
                {step === "confirmed" ? "Ticket Confirmed" : "Event Ticket Checkout"}
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

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="mt-5 space-y-5">
            {/* Event Summary Card */}
            <div className="rounded-2xl border border-base-200 bg-base-50/70 p-4 sm:p-5">
              <span className="badge badge-primary badge-outline text-xs font-semibold uppercase tracking-wider mb-2">
                {event.category || "Event"}
              </span>
              <h4 className="text-base font-bold text-[#0D154B] leading-snug sm:text-lg">
                {event.title}
              </h4>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs text-base-content/80">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={16}
                    className="text-primary shrink-0"
                  />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={16}
                    className="text-primary shrink-0"
                  />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <HugeiconsIcon
                    icon={isVirtual ? ComputerIcon : Location01Icon}
                    size={16}
                    className="text-primary shrink-0"
                  />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-2xl border border-base-200 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-base-content/70">
                <span>Standard Admission Ticket</span>
                <span>{event.ticketPrice}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-base-content/70">
                <span>Processing & Platform Fee</span>
                <span className="text-success font-medium">Included</span>
              </div>
              <div className="divider my-1" />
              <div className="flex items-center justify-between text-base font-bold text-[#0D154B] sm:text-lg">
                <span>Total Amount</span>
                <span className="text-primary">{event.ticketPrice}</span>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs text-base-content/60 px-1">
              <HugeiconsIcon icon={LockKeyIcon} size={14} className="text-success" />
              <span>Payments are processed securely via Stripe with 256-bit encryption.</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={isInitiating}
                className="btn btn-primary btn-block h-12 min-h-12 rounded-xl text-sm font-bold text-white normal-case shadow-sm gap-2"
              >
                {isInitiating ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={18}
                      className="animate-spin"
                    />
                    <span>Connecting to Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Payment</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isInitiating}
                className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/70"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step: Stripe Elements Payment */}
        {step === "stripe" && paymentData?.clientSecret && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-primary/5 p-3 text-xs">
              <span className="text-base-content/70">Paying for:</span>
              <span className="font-bold text-[#0D154B]">{event.ticketPrice}</span>
            </div>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: paymentData.clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#0D154B",
                    colorBackground: "#ffffff",
                    colorText: "#0D154B",
                    borderRadius: "12px",
                  },
                },
              }}
            >
              <EventStripeForm
                clientSecret={paymentData.clientSecret}
                ticketRef={
                  paymentData.reference ||
                  paymentData.ticketNumber ||
                  `TK-${eventId.slice(0, 6).toUpperCase()}`
                }
                event={event}
                onSuccess={handlePaymentSuccess}
                onClose={onClose}
              />
            </Elements>
          </div>
        )}

        {/* Step: Confirmed / Ticket Pass */}
        {step === "confirmed" && (
          <div className="mt-6 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={36} />
            </div>

            <div>
              <h4 className="text-xl font-bold text-[#0D154B] sm:text-2xl">
                You&apos;re Officially Registered!
              </h4>
              <p className="mt-1.5 text-xs text-base-content/70 sm:text-sm">
                Your ticket has been confirmed. A calendar invitation and access
                link have been dispatched to your email.
              </p>
            </div>

            {/* Ticket Pass Slip */}
            <div className="rounded-2xl border-2 border-dashed border-[#C99E4A] bg-[#FAF8F5] p-5 text-left">
              <div className="flex items-center justify-between border-b border-base-200/80 pb-3">
                <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
                  Ticket Reference
                </span>
                <span className="font-mono text-xs font-bold text-[#0D154B]">
                  {confirmedTicketNumber || `TK-${eventId.slice(0, 8).toUpperCase()}`}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <h5 className="text-sm font-bold text-[#0D154B]">
                  {event.title}
                </h5>
                <p className="text-xs text-base-content/70">
                  {event.date} • {event.time}
                </p>
                <p className="text-xs text-primary font-medium">
                  {event.location}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/dashboard");
                }}
                className="btn btn-primary btn-block h-12 min-h-12 rounded-xl text-sm font-bold text-white normal-case shadow-sm"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/70"
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
