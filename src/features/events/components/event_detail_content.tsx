"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  ComputerIcon,
  Loading03Icon,
  Location01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import EventDetailGallery from "@/features/events/components/event_detail_gallery";
import type { ChlpsEvent } from "@/features/events/events_data";
import { getEventDetailView } from "@/features/events/event_detail_view";
import { useAppSelector } from "@/lib/store/store";
import {
  useEventRegistrationStatus,
  useJoinFreeEvent,
} from "../hooks/use_event_registration";
import { eventRegistrationService } from "../services/event_registration_service";
import EventPaymentModal from "./event_payment_modal";
import EventTicketModal from "./event_ticket_modal";
import FreeEventRegistrationModal from "./free_event_registration_modal";

function DetailMetaRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3.5 ${
        last ? "" : "border-b border-base-200/80 pb-4"
      }`}
    >
      <HugeiconsIcon
        icon={icon}
        size={18}
        color="#161058"
        strokeWidth={1.8}
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
          {label}
        </p>
        <p className="mt-1 whitespace-pre-line text-sm font-bold leading-snug text-[#071649] sm:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function EventDetailContent({ event }: { event: ChlpsEvent }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAppSelector((state) => state.user.token);

  const view = getEventDetailView(event);
  const eventId = event.raw?.id || event.id;

  const { isRegistered, registration, refetch } =
    useEventRegistrationStatus(eventId);
  const joinMutation = useJoinFreeEvent();

  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [confirmedTicketNum, setConfirmedTicketNum] = useState<string>("");

  // Handle auto-opening free registration if redirected back from sign-in
  useEffect(() => {
    if (
      searchParams?.get("register") === "free" &&
      token &&
      view.isFree &&
      !isRegistered
    ) {
      setIsFreeModalOpen(true);
    }
  }, [searchParams, token, view.isFree, isRegistered]);

  // Handle return from PayPal redirect if any
  useEffect(() => {
    const paymentStatus = searchParams?.get("payment");
    const paymentRef =
      searchParams?.get("ref") ||
      searchParams?.get("reference") ||
      searchParams?.get("payment_intent");

    if (paymentStatus === "success" && paymentRef) {
      eventRegistrationService.confirmEventPayment(paymentRef).then((res) => {
        if (res.success) {
          toast.success("Payment verified! Your ticket has been confirmed.");
          setConfirmedTicketNum(paymentRef);
          refetch();
          setIsTicketModalOpen(true);
        }
      });
    }
  }, [searchParams, refetch]);

  const handleActionClick = async () => {
    // 1. If not authenticated, prompt sign-in with redirect back
    if (!token) {
      const queryParam = view.isFree ? "?register=free" : "";
      const currentPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${queryParam}`
          : `/events/${event.id}${queryParam}`;
      router.push(
        `/dashboard/sign-in?redirect=${encodeURIComponent(currentPath)}`,
      );
      return;
    }

    // 2. If already registered, open the digital pass/ticket modal
    if (isRegistered) {
      setIsTicketModalOpen(true);
      return;
    }

    // 3. If Free Event -> Open Free Registration Confirmation Modal
    if (view.isFree) {
      setIsFreeModalOpen(true);
      return;
    }

    // 4. If Paid Event -> Open secure payment modal
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="mt-6 grid items-start gap-5 lg:mt-7 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      {/* Main Content Article */}
      <article className="overflow-hidden rounded-3xl bg-white shadow-sm border border-base-200/80">
        <EventDetailGallery images={event.gallery} alt={event.imageAlt} />

        <div className="px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary sm:text-base">
            {view.typeLabel}
          </p>
          <h1 className="mt-2.5 text-2xl font-bold leading-tight tracking-tight text-[#161058] sm:text-4xl xl:text-5xl">
            {event.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#333041] sm:text-lg">
            {event.description}
          </p>

          <hr className="my-8 border-base-200" />

          {/* Agenda / Overview */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-[#071649] sm:text-2xl">
              About This Event
            </h2>
            <div className="prose max-w-none text-base-content/80">
              <p className="text-sm sm:text-base leading-relaxed">
                {(event.raw as any)?.overview ||
                  event.description ||
                  "Join industry practitioners and chartered specialists for an engaging session designed to expand operational capabilities, governance readiness, and security excellence."}
              </p>
            </div>
          </section>
        </div>
      </article>

      {/* Sidebar: Event Metadata & Registration Action */}
      <aside className="space-y-5 lg:sticky lg:top-24">
        {/* Meta card */}
        <div className="rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6 border border-[#E0DAF1]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#071649]">
            Event Information
          </h3>

          <div className="mt-4 space-y-4">
            <DetailMetaRow
              icon={Calendar03Icon}
              label="Date"
              value={event.date}
            />
            <DetailMetaRow icon={Clock01Icon} label="Time" value={event.time} />
            <DetailMetaRow
              icon={view.isVirtual ? ComputerIcon : Location01Icon}
              label={view.placeLabel}
              value={view.placeValue}
              last
            />
          </div>
        </div>

        {/* Ticket / Registration Box */}
        <div className="rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6 border border-[#E0DAF1]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Admission Ticket
            </p>
            {isRegistered && (
              <span className="badge badge-success badge-sm text-white font-semibold text-xs gap-1">
                <HugeiconsIcon icon={Tick02Icon} size={12} />
                Registered
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-2xl font-bold leading-none text-[#161058] sm:text-3xl">
              {view.ticketPrice}
            </p>
            {view.isLive ? (
              <span className="badge badge-success badge-outline text-xs font-semibold">
                Live
              </span>
            ) : view.isPast ? (
              <span className="badge badge-ghost text-xs font-semibold text-base-content/60">
                Concluded
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-xs text-base-content/70">
            {isRegistered
              ? "You hold a confirmed registration for this event."
              : view.ticketNote}
          </p>

          {/* Action CTA Button */}
          {view.canBuyTicket ? (
            <button
              type="button"
              onClick={handleActionClick}
              disabled={joinMutation.isPending}
              className={`btn btn-block mt-5 h-12 min-h-12 rounded-xl text-sm font-bold normal-case shadow-sm gap-2 ${
                isRegistered
                  ? "btn-success text-white hover:brightness-95"
                  : "btn-primary text-white"
              }`}
            >
              {joinMutation.isPending ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={16}
                    className="animate-spin"
                  />
                  <span>Registering...</span>
                </>
              ) : isRegistered ? (
                <>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                  <span>View My Ticket Pass</span>
                </>
              ) : (
                <>
                  <span>
                    {view.isFree
                      ? "Register Free"
                      : `Buy Ticket • ${view.ticketPrice}`}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={2}
                  />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="btn btn-disabled btn-block mt-5 h-12 min-h-12 rounded-xl text-sm font-semibold opacity-70"
            >
              {view.ctaLabel}
            </button>
          )}
        </div>
      </aside>

      {/* Free Event Registration Confirmation Modal */}
      <FreeEventRegistrationModal
        isOpen={isFreeModalOpen}
        onClose={() => setIsFreeModalOpen(false)}
        event={event}
        onSuccess={(result) => {
          setIsFreeModalOpen(false);
          const ticketNum =
            result?.ticketNumber ||
            result?.id ||
            `TK-${eventId.slice(0, 8).toUpperCase()}`;
          setConfirmedTicketNum(ticketNum);
          refetch();
          setIsTicketModalOpen(true);
        }}
      />

      {/* PayPal Payment Modal for Paid Events */}
      <EventPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        event={event}
        onSuccess={(ref) => {
          if (ref) setConfirmedTicketNum(ref);
          refetch();
          setIsTicketModalOpen(true);
        }}
      />

      {/* Ticket Pass Modal for Registered Attendees */}
      <EventTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        event={event}
        registration={registration}
        ticketNumber={confirmedTicketNum}
      />
    </div>
  );
}
