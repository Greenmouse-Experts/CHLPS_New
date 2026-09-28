"use client";

import React, { useState, useEffect, useRef } from "react";
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
  CreditCardIcon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  ComputerIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Modal, { type ModalHandle } from "@/components/DialogModal";
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
  const trx = paymentData.transaction;
  const finalThirdPartyRef =
    trx?.thirdPartyRef ||
    paymentData.thirdPartyRef ||
    trx?.reference ||
    paymentData.reference ||
    `TK-${eventId.slice(0, 6).toUpperCase()}`;

  const safeAmount = Number(
    (trx?.amount || paymentData.amount || numericAmount).toFixed(2),
  );

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

              // 1. If backend provided a direct PayPal approval redirect URL
              const redirectUrl =
                paymentData.authorization_url ||
                paymentData.authorizationUrl ||
                paymentData.approvalUrl ||
                paymentData.approval_url ||
                trx?.authorization_url ||
                trx?.approvalUrl;

              if (redirectUrl) {
                window.location.href = redirectUrl;
                return "";
              }

              // 2. If backend created PayPal session / order (sessionId returned by backend)
              const existingSessionId =
                trx?.sessionId ||
                paymentData.sessionId ||
                paymentData.paypalOrderId;

              if (existingSessionId) {
                return existingSessionId;
              }

              // 3. Fallback: Create PayPal order on client side
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    reference_id: finalThirdPartyRef,
                    description:
                      trx?.narration || `Event Ticket: ${event.title}`,
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
                // Try capturing order on client side if order was created as client capture
                if (actions && actions.order) {
                  try {
                    await actions.order.capture();
                  } catch (captureErr) {
                    console.info("PayPal client capture notice:", captureErr);
                  }
                }

                // Complete payment with the backend using thirdPartyRef
                const targetRef =
                  trx?.thirdPartyRef ||
                  paymentData.thirdPartyRef ||
                  trx?.reference ||
                  paymentData.reference ||
                  data.orderID;

                if (!targetRef) {
                  throw new Error("Missing event payment reference.");
                }

                const confirmRes =
                  await eventRegistrationService.confirmEventPayment(
                    targetRef,
                    {
                      orderId: data.orderID,
                      payerId: data.payerID,
                      sessionId: trx?.sessionId || paymentData.sessionId,
                      reference: trx?.reference || paymentData.reference,
                    },
                  );

                if (!confirmRes.success) {
                  throw new Error(
                    confirmRes.message ||
                      "Failed to confirm event ticket with server.",
                  );
                }

                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("chlps_pending_event_payment");
                }

                toast.success(
                  "Payment confirmed! Your ticket has been issued.",
                );

                const ticketResult =
                  confirmRes.data?.ticketNumber ||
                  confirmRes.data?.registration?.ticketNumber ||
                  paymentData.ticketNumber ||
                  targetRef;

                onPaymentSuccess(ticketResult);
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
        paymentData.approval_url ||
        trx?.authorization_url ||
        trx?.approvalUrl) && (
        <div className="pt-2 text-center">
          <a
            href={
              paymentData.authorization_url ||
              paymentData.authorizationUrl ||
              paymentData.approvalUrl ||
              paymentData.approval_url ||
              trx?.authorization_url ||
              trx?.approvalUrl
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
 * Exclusively powered by PayPal & Integrated with DialogModal
 */
export default function EventPaymentModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: EventPaymentModalProps) {
  const router = useRouter();
  const modalRef = useRef<ModalHandle>(null);

  const [step, setStep] = useState<"preview" | "paypal" | "confirmed">(
    "preview",
  );
  const [isInitiating, setIsInitiating] = useState(false);
  const [paymentData, setPaymentData] =
    useState<EventRegistrationPaymentResult | null>(null);
  const [confirmedTicketNumber, setConfirmedTicketNumber] =
    useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setStep("preview");
      setIsInitiating(false);
      setPaymentData(null);
      setConfirmedTicketNumber("");
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

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

      const targetRef =
        data.transaction?.thirdPartyRef ||
        data.thirdPartyRef ||
        data.transaction?.reference ||
        data.reference;

      // Save pending metadata for seamless browser redirect return handling
      if (typeof window !== "undefined" && targetRef) {
        sessionStorage.setItem(
          "chlps_pending_event_payment",
          JSON.stringify({
            eventId,
            thirdPartyRef: targetRef,
            reference: data.transaction?.reference || data.reference,
            sessionId: data.transaction?.sessionId || data.sessionId,
            timestamp: Date.now(),
          }),
        );
      }

      const redirectUrl =
        data.authorization_url ||
        data.authorizationUrl ||
        data.approvalUrl ||
        data.approval_url ||
        data.transaction?.authorization_url ||
        data.transaction?.approvalUrl;

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

  const trx = paymentData?.transaction;
  const subAmount = trx?.subAmount ?? paymentData?.subAmount ?? numericPrice;
  const totalAmount = trx?.amount ?? paymentData?.amount ?? numericPrice;
  const taxOrFee = totalAmount > subAmount ? totalAmount - subAmount : 0;

  return (
    <Modal
      ref={modalRef}
      title={
        step === "confirmed"
          ? "Ticket Confirmed"
          : step === "paypal"
            ? "Complete PayPal Payment"
            : "Event Ticket Checkout"
      }
      maxWidth="max-w-lg"
      actions={
        step === "preview" ? (
          <div className="flex w-full items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 rounded-xl text-xs sm:text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={isInitiating}
              className="btn btn-primary flex-1 rounded-xl text-xs sm:text-sm font-bold text-white normal-case shadow-sm gap-2"
            >
              {isInitiating ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={16}
                    className="animate-spin"
                  />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>Proceed to PayPal</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                </>
              )}
            </button>
          </div>
        ) : step === "paypal" ? (
          <div className="flex w-full items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setStep("preview")}
              className="btn btn-ghost btn-sm rounded-xl text-xs text-base-content/70 hover:text-base-content"
            >
              Back to Summary
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/dashboard/events");
              }}
              className="btn btn-primary btn-sm rounded-xl text-xs font-bold text-white normal-case shadow-sm w-full sm:w-auto"
            >
              Go to My Events
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/70 w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        )
      }
    >
      <div>
        {/* STEP 1: PREVIEW */}
        {step === "preview" && (
          <div className="space-y-4">
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
              <div className="flex justify-between items-center text-xs sm:text-sm text-base-content/70">
                <span>Standard Ticket Access:</span>
                <span className="font-semibold text-base-content">
                  ${numericPrice.toLocaleString()} {currency}
                </span>
              </div>
              <div className="mt-2.5 flex justify-between items-center border-t border-base-200/80 pt-2.5">
                <span className="text-xs sm:text-sm font-bold text-[#0D154B]">
                  Total Payment:
                </span>
                <span className="text-base sm:text-lg font-extrabold text-primary">
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
                Instant electronic ticket pass issued immediately upon
                completing PayPal payment.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: PAYPAL CHECKOUT */}
        {step === "paypal" && paymentData && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-base-200 bg-base-50 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-base-content/70">Admission Ticket:</span>
                <span className="font-semibold text-[#0D154B]">
                  ${subAmount.toFixed(2)} {currency}
                </span>
              </div>

              {taxOrFee > 0 && (
                <div className="flex justify-between items-center text-xs text-base-content/70">
                  <span>Processing / Service Fee:</span>
                  <span>
                    ${taxOrFee.toFixed(2)} {currency}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-base-200 pt-2 text-sm font-bold">
                <span className="text-[#0D154B]">Total Amount to Pay:</span>
                <span className="text-primary text-base font-extrabold">
                  ${totalAmount.toFixed(2)} {currency}
                </span>
              </div>

              {trx?.thirdPartyRef && (
                <div className="pt-1 text-[11px] font-mono text-base-content/50 truncate">
                  Ref: {trx.thirdPartyRef}
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
              <EventPayPalButtons
                event={event}
                paymentData={paymentData}
                numericAmount={totalAmount}
                currency={currency}
                onPaymentSuccess={handlePaymentSuccess}
                onClose={onClose}
              />
            </PayPalScriptProvider>
          </div>
        )}

        {/* STEP 3: CONFIRMED */}
        {step === "confirmed" && (
          <div className="space-y-5 text-center py-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} />
            </div>

            <div>
              <h4 className="text-base font-bold text-[#0D154B] sm:text-lg">
                Registration Confirmed!
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-base-content/70">
                You are confirmed to attend <strong>{event.title}</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
              <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold">
                Ticket Reference
              </span>
              <p className="mt-1 font-mono text-sm sm:text-base font-extrabold text-emerald-900 tracking-wide">
                {confirmedTicketNumber ||
                  paymentData?.ticketNumber ||
                  trx?.thirdPartyRef ||
                  `TK-${eventId.slice(0, 6).toUpperCase()}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
