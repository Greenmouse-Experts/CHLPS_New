"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  Clock01Icon,
  ComputerIcon,
  Location01Icon,
  Ticket01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Mail01Icon,
  UserIcon,
  AlertCircleIcon,
  Loading03Icon,
  HourglassIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { useAppSelector } from "@/lib/store/store";
import { eventRegistrationService } from "@/features/events/services/event_registration_service";
import {
  formatEventDate,
  formatEventTime,
  calculateEventDuration,
  transformEventApiToChlpsEvent,
} from "@/features/events/services/event_service";
import EventTicketModal from "@/features/events/components/event_ticket_modal";
import type { EventRegistration } from "@/types/events";
import type { ChlpsEvent } from "@/features/events/events_data";

interface DashboardEventDetailPageProps {
  id: string;
}

export default function DashboardEventDetailPage({
  id,
}: DashboardEventDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.user);
  const token = user.token;

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Fetch all registrations to resolve by id or eventId
  const registrationsQuery = useQuery({
    queryKey: ["my-event-registrations", token],
    queryFn: async () => {
      const res = await eventRegistrationService.getMyEventRegistrations();
      if (res.success && res.data) {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray((res.data as any).items)) {
          return (res.data as any).items as EventRegistration[];
        }
      }
      return [] as EventRegistration[];
    },
    enabled: Boolean(token),
    staleTime: 60 * 1000,
  });

  // Also query specific registration details if available
  const singleQuery = useQuery({
    queryKey: ["my-event-registration", id],
    queryFn: async () => {
      const res = await eventRegistrationService.getMyRegistration(id);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    },
    enabled: Boolean(token && id),
    staleTime: 60 * 1000,
    retry: 1,
  });

  // Resolve matching registration
  const registration: EventRegistration | undefined = useMemo(() => {
    if (singleQuery.data) return singleQuery.data;

    const list = registrationsQuery.data || [];
    return list.find(
      (r) =>
        r.id === id ||
        r.eventId === id ||
        r.event?.id === id ||
        r.event?.slug === id,
    );
  }, [singleQuery.data, registrationsQuery.data, id]);

  const isLoading =
    (singleQuery.isLoading && registrationsQuery.isLoading) ||
    (!registration && (singleQuery.isLoading || registrationsQuery.isLoading));

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async (regId: string) => {
      const res = await eventRegistrationService.cancelRegistration(regId);
      if (!res.success) {
        throw new Error(res.message || "Failed to cancel registration");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Event registration cancelled successfully.");
      setIsCancelModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["my-event-registrations"] });
      queryClient.invalidateQueries({
        queryKey: ["my-event-registration", id],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to cancel registration.");
    },
  });

  const event = registration?.event;
  const isVirtual =
    event?.format === "Virtual" ||
    event?.location?.toLowerCase() === "online" ||
    Boolean(event?.meetingLink);

  const dateFormatted = formatEventDate(event?.startDate, event?.endDate);
  const timeFormatted = formatEventTime(event?.startTime, event?.endTime);
  const duration = calculateEventDuration(
    event?.startDate,
    event?.startTime,
    event?.endDate,
    event?.endTime,
  );

  const categoryName =
    typeof event?.category === "object"
      ? event?.category?.name
      : event?.category || "Professional Event";

  // Transformed event view for the pass modal
  const eventView: ChlpsEvent | null = useMemo(() => {
    if (!event) return null;
    return transformEventApiToChlpsEvent(event);
  }, [event]);

  // Status mapping
  const statusConfig: Record<
    string,
    { label: string; badgeClass: string; icon: any }
  > = {
    Confirmed: {
      label: "Confirmed",
      badgeClass: "badge-success text-white",
      icon: CheckmarkCircle02Icon,
    },
    Attended: {
      label: "Attended",
      badgeClass: "badge-info text-white",
      icon: CheckmarkCircle02Icon,
    },
    Waitlisted: {
      label: "Waitlisted",
      badgeClass: "badge-warning text-white",
      icon: HourglassIcon,
    },
    Cancelled: {
      label: "Cancelled",
      badgeClass: "badge-error text-white",
      icon: Cancel01Icon,
    },
  };

  const status = statusConfig[registration?.status || "Confirmed"] || {
    label: registration?.status || "Confirmed",
    badgeClass: "badge-neutral text-white",
    icon: CheckmarkCircle02Icon,
  };

  const isCancelled = registration?.status === "Cancelled";

  // Google Calendar Link generator
  const googleCalendarUrl = useMemo(() => {
    if (!event?.startDate) return "";
    try {
      const startClean = event.startDate.replace(/-/g, "");
      const endClean = (event.endDate || event.startDate).replace(/-/g, "");
      const startTimeClean = (event.startTime || "09:00")
        .replace(/:/g, "")
        .slice(0, 4);
      const endTimeClean = (event.endTime || "17:00")
        .replace(/:/g, "")
        .slice(0, 4);

      const startIso = `${startClean}T${startTimeClean}00Z`;
      const endIso = `${endClean}T${endTimeClean}00Z`;

      const title = encodeURIComponent(event.name || "CHLPS Event");
      const details = encodeURIComponent(
        `${event.description || ""}\n\nTicket No: ${registration?.ticketNumber || ""}`,
      );
      const location = encodeURIComponent(
        isVirtual
          ? event.meetingLink || "Online (Virtual Session)"
          : event.location || "CHLPS Institute",
      );

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    } catch {
      return "";
    }
  }, [event, registration, isVirtual]);

  return (
    <DashboardLayout title="Event Details">
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Back Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-200/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
            <Link
              href="/dashboard/events"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              <span>My Events</span>
            </Link>
            <span>/</span>
            <span className="text-base-content truncate max-w-xs sm:max-w-md">
              {event?.name || "Event Registration"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {event && (
              <Link
                href={`/events/${event.slug || event.id}`}
                target="_blank"
                className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold gap-1 text-base-content/70 hover:text-base-content"
              >
                <span>View Public Page</span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
              </Link>
            )}

            {!isCancelled && (
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(true)}
                className="btn btn-primary btn-sm rounded-xl text-xs font-bold text-white normal-case shadow-xs gap-1.5"
              >
                <HugeiconsIcon icon={Ticket01Icon} size={14} />
                <span>Digital Pass</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-44 bg-base-200 rounded-3xl w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-base-200 rounded w-1/3" />
                <div className="h-24 bg-base-200 rounded-2xl w-full" />
                <div className="h-40 bg-base-200 rounded-2xl w-full" />
              </div>
              <div className="h-64 bg-base-200 rounded-2xl w-full" />
            </div>
          </div>
        ) : !registration ? (
          <div className="card border border-dashed border-base-300 bg-white p-12 text-center rounded-3xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
              <HugeiconsIcon icon={AlertCircleIcon} size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0D154B] sm:text-xl">
              Registration Not Found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              The event registration you requested could not be located or may
              have been removed.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/dashboard/events"
                className="btn btn-primary btn-md rounded-2xl text-sm font-bold text-white normal-case shadow-sm gap-2"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                <span>Return to My Events</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
            {/* Left Column: Event Information */}
            <div className="space-y-6">
              {/* Event Hero Card */}
              <div className="card border border-base-200/80 bg-white p-6 sm:p-8 rounded-3xl shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="badge badge-primary badge-outline text-xs font-semibold px-3 py-1">
                    {categoryName}
                  </span>
                  <span
                    className={`badge badge-md text-xs font-bold gap-1 px-3 py-1 ${status.badgeClass}`}
                  >
                    <HugeiconsIcon icon={status.icon} size={14} />
                    <span>{status.label}</span>
                  </span>
                </div>

                <h1 className="mt-4 text-xl font-bold leading-tight text-[#0D154B] sm:text-3xl">
                  {event?.name || "Professional Event"}
                </h1>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-base-content/80">
                  {event?.description ||
                    "Join industry practitioners and chartered specialists for an engaging session designed to expand operational capabilities, governance readiness, and security excellence."}
                </p>

                {/* Key metadata grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-base-200/80 pt-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <HugeiconsIcon icon={Calendar03Icon} size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                        Date
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#0D154B]">
                        {dateFormatted || "Scheduled"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <HugeiconsIcon icon={Clock01Icon} size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                        Time & Duration
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#0D154B]">
                        {timeFormatted || "Session TBA"}
                        {duration ? ` • ${duration}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <HugeiconsIcon
                        icon={isVirtual ? ComputerIcon : Location01Icon}
                        size={18}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                        {isVirtual ? "Virtual Access" : "Location"}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#0D154B] truncate">
                        {isVirtual
                          ? "Online Webinar Session"
                          : event?.location || "In-Person Venue"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance & Check-in Guidelines */}
              <div className="card border border-base-200/80 bg-white p-6 sm:p-7 rounded-3xl shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#0D154B] sm:text-lg">
                  Attendee Guidelines & Instructions
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-base-content/75 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <p>
                      Please have your <strong>Ticket Reference</strong> ready
                      upon check-in. Digital passes can be presented on your mobile
                      device.
                    </p>
                  </div>

                  {isVirtual ? (
                    <div className="flex items-start gap-2.5">
                      <HugeiconsIcon
                        icon={ComputerIcon}
                        size={18}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      <p>
                        For virtual sessions, please join 5-10 minutes prior to
                        the scheduled start time to test audio and connection.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={18}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      <p>
                        Please arrive 15 minutes before the opening session for
                        physical registration and badge pickup.
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={18}
                      className="text-primary shrink-0 mt-0.5"
                    />
                    <p>
                      Session reminders and post-event resource materials will be
                      sent to your registered email address.
                    </p>
                  </div>
                </div>
              </div>

              {/* Organizer Contact Info */}
              {(event?.organizerName || event?.contactEmail) && (
                <div className="card border border-base-200/80 bg-white p-6 rounded-3xl shadow-xs space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#0D154B]">
                    Event Host & Support
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-base-content/80">
                    {event?.organizerName && (
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={UserIcon}
                          size={16}
                          className="text-primary shrink-0"
                        />
                        <span>{event.organizerName}</span>
                      </div>
                    )}
                    {event?.contactEmail && (
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Mail01Icon}
                          size={16}
                          className="text-primary shrink-0"
                        />
                        <a
                          href={`mailto:${event.contactEmail}`}
                          className="text-primary hover:underline truncate"
                        >
                          {event.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Ticket Pass & Actions */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              {/* Official Ticket Card Slip */}
              <div className="card border-2 border-[#C99E4A] bg-[#FAF8F5] p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#C99E4A]/30 pb-3">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-base-content/60">
                      Admission Pass
                    </span>
                    <span className="font-mono text-sm font-bold text-[#0D154B]">
                      {registration.ticketNumber ||
                        `REG-${registration.id.slice(0, 8)}`}
                    </span>
                  </div>
                  <span
                    className={`badge badge-sm text-xs font-bold ${status.badgeClass}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-base-content/80">
                  <div className="flex justify-between py-1 border-b border-[#C99E4A]/20">
                    <span className="text-base-content/60">Attendee:</span>
                    <span className="font-semibold text-[#0D154B]">
                      {registration.user?.fullName ||
                        user.fullName ||
                        [user.firstName, user.lastName]
                          .filter(Boolean)
                          .join(" ") ||
                        "CHLPS Member"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#C99E4A]/20">
                    <span className="text-base-content/60">Email:</span>
                    <span className="font-semibold truncate max-w-[150px]">
                      {registration.user?.email || user.email || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#C99E4A]/20">
                    <span className="text-base-content/60">Registered On:</span>
                    <span>
                      {registration.registrationDate
                        ? formatEventDate(registration.registrationDate)
                        : formatEventDate(registration.createdAt)}
                    </span>
                  </div>
                </div>

                {!isCancelled && (
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(true)}
                    className="btn btn-primary btn-block h-11 min-h-11 rounded-xl text-xs font-bold text-white normal-case shadow-xs gap-1.5"
                  >
                    <HugeiconsIcon icon={Ticket01Icon} size={15} />
                    <span>View Full Admission Ticket</span>
                  </button>
                )}
              </div>

              {/* Virtual Access Meeting Box */}
              {isVirtual && event?.meetingLink && !isCancelled && (
                <div className="card border border-primary/20 bg-primary/5 p-5 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <HugeiconsIcon icon={ComputerIcon} size={18} />
                    <span>Virtual Meeting Access</span>
                  </div>
                  <p className="text-xs text-base-content/70">
                    Access the interactive live broadcast when the session
                    commences.
                  </p>
                  <a
                    href={event.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-full rounded-xl text-xs font-bold text-white normal-case shadow-xs gap-1.5 flex items-center justify-center"
                  >
                    <span>Launch Virtual Room</span>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
                  </a>
                </div>
              )}

              {/* Calendar & Actions Box */}
              {!isCancelled && (
                <div className="card border border-base-200 bg-white p-5 rounded-3xl space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0D154B]">
                    Session Actions
                  </p>

                  {googleCalendarUrl && (
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm w-full rounded-xl text-xs font-semibold normal-case gap-2"
                    >
                      <HugeiconsIcon icon={Calendar03Icon} size={14} />
                      <span>Add to Google Calendar</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="btn btn-ghost btn-sm w-full rounded-xl text-xs font-semibold text-error hover:bg-error/10 normal-case"
                  >
                    Cancel Registration
                  </button>
                </div>
              )}

              {isCancelled && (
                <div className="alert alert-error rounded-2xl p-4 text-xs text-white">
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                  <span>
                    Your registration for this event was cancelled.
                  </span>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>

      {/* Full Ticket Modal */}
      {eventView && (
        <EventTicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          event={eventView}
          registration={registration}
          ticketNumber={registration?.ticketNumber}
        />
      )}

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all border border-base-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error">
              <HugeiconsIcon icon={AlertCircleIcon} size={28} />
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-[#0D154B]">
              Cancel Event Registration?
            </h3>

            <p className="mt-2 text-center text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Are you sure you want to cancel your attendance for{" "}
              <strong>{event?.name}</strong>? Your ticket pass will be voided
              and virtual session access will be revoked.
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={cancelMutation.isPending}
                className="btn btn-ghost btn-md flex-1 rounded-2xl text-sm font-semibold"
              >
                Keep Registration
              </button>

              <button
                type="button"
                onClick={() => registration && cancelMutation.mutate(registration.id)}
                disabled={cancelMutation.isPending}
                className="btn btn-error btn-md flex-1 rounded-2xl text-sm font-bold text-white normal-case shadow-sm gap-2"
              >
                {cancelMutation.isPending ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={16}
                      className="animate-spin"
                    />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
