"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  Clock01Icon,
  ComputerIcon,
  Location01Icon,
  Ticket01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Search01Icon,
  ArrowUpRight01Icon,
  HourglassIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Assets } from "@/lib/assets";
import { useMyEventRegistrations } from "@/features/events/hooks/use_event_registration";
import {
  formatEventDate,
  formatEventTime,
  transformEventApiToChlpsEvent,
} from "@/features/events/services/event_service";
import EventTicketModal from "@/features/events/components/event_ticket_modal";
import {
  EventCardBackdrop,
  EventMeta,
  ImageOverlayBadge,
} from "@/features/events/components/event_ui";
import type { EventRegistration } from "@/types/events";
import type { ChlpsEvent } from "@/features/events/events_data";

export default function EventsDashboardPage() {
  const { data: registrations = [], isLoading, refetch } =
    useMyEventRegistrations();
  const [filter, setFilter] = useState<"all" | "upcoming" | "past" | "virtual">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketRegistration, setSelectedTicketRegistration] =
    useState<EventRegistration | null>(null);

  const now = new Date();

  // Helper to determine if an event registration has passed
  const isPastEvent = (reg: EventRegistration) => {
    if (reg.event?.endDate || reg.event?.startDate) {
      const dateStr = reg.event.endDate || reg.event.startDate;
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed < now;
      }
    }
    return reg.status === "Attended";
  };

  const isVirtualEvent = (reg: EventRegistration) => {
    return (
      reg.event?.format === "Virtual" ||
      reg.event?.location?.toLowerCase() === "online" ||
      Boolean(reg.event?.meetingLink)
    );
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = reg.event?.name?.toLowerCase() || "";
        const ticket = reg.ticketNumber?.toLowerCase() || "";
        const desc = reg.event?.description?.toLowerCase() || "";
        if (!title.includes(q) && !ticket.includes(q) && !desc.includes(q)) {
          return false;
        }
      }

      // 2. Tab filter
      if (filter === "upcoming") {
        return !isPastEvent(reg) && reg.status !== "Cancelled";
      }
      if (filter === "past") {
        return isPastEvent(reg) || reg.status === "Attended";
      }
      if (filter === "virtual") {
        return isVirtualEvent(reg);
      }

      return true;
    });
  }, [registrations, filter, searchQuery]);

  // Statistics
  const totalCount = registrations.length;
  const upcomingCount = useMemo(
    () =>
      registrations.filter(
        (r) => !isPastEvent(r) && r.status !== "Cancelled",
      ).length,
    [registrations],
  );
  const virtualCount = useMemo(
    () => registrations.filter(isVirtualEvent).length,
    [registrations],
  );
  const pastCount = useMemo(
    () =>
      registrations.filter((r) => isPastEvent(r) || r.status === "Attended")
        .length,
    [registrations],
  );

  // Convert selected registration to ChlpsEvent for the pass modal
  const selectedEventView: ChlpsEvent | null = useMemo(() => {
    if (!selectedTicketRegistration?.event) return null;
    return transformEventApiToChlpsEvent(selectedTicketRegistration.event);
  }, [selectedTicketRegistration]);

  return (
    <DashboardLayout title="My Events">
      <div className="space-y-8">
        {/* Page Subheader */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0D154B] sm:text-2xl">
              Registered Events & Passes
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Manage your confirmed webinars, conferences, and workshops. Access
              digital admission passes and meeting links.
            </p>
          </div>

          <Link
            href="/events"
            className="btn btn-outline btn-sm rounded-xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
          >
            <span>Explore All Events</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              color="currentColor"
            />
          </Link>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Total Registrations
                </p>
                <p className="mt-1 text-2xl font-bold text-[#0D154B]">
                  {totalCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={Ticket01Icon} size={22} />
              </div>
            </div>
          </div>

          <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Upcoming Events
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">
                  {upcomingCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <HugeiconsIcon icon={Calendar03Icon} size={22} />
              </div>
            </div>
          </div>

          <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Virtual Sessions
                </p>
                <p className="mt-1 text-2xl font-bold text-sky-600">
                  {virtualCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
                <HugeiconsIcon icon={ComputerIcon} size={22} />
              </div>
            </div>
          </div>

          <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Past / Concluded
                </p>
                <p className="mt-1 text-2xl font-bold text-base-content/70">
                  {pastCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-200 text-base-content/70">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="tabs tabs-boxed bg-base-200/60 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`tab tab-sm rounded-xl text-xs font-bold transition-all ${
                filter === "all" ? "tab-active bg-white text-[#0D154B] shadow-xs" : "text-base-content/70"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`tab tab-sm rounded-xl text-xs font-bold transition-all ${
                filter === "upcoming" ? "tab-active bg-white text-[#0D154B] shadow-xs" : "text-base-content/70"
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setFilter("virtual")}
              className={`tab tab-sm rounded-xl text-xs font-bold transition-all ${
                filter === "virtual" ? "tab-active bg-white text-[#0D154B] shadow-xs" : "text-base-content/70"
              }`}
            >
              Virtual ({virtualCount})
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`tab tab-sm rounded-xl text-xs font-bold transition-all ${
                filter === "past" ? "tab-active bg-white text-[#0D154B] shadow-xs" : "text-base-content/70"
              }`}
            >
              Past ({pastCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by event or ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm w-full rounded-xl border-base-300 bg-white pl-9 text-xs focus:border-primary focus:outline-hidden"
            />
            <HugeiconsIcon
              icon={Search01Icon}
              size={15}
              className="absolute left-3 top-2.5 text-base-content/40"
            />
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card border border-base-200 bg-white p-5 space-y-4 animate-pulse rounded-2xl"
              >
                <div className="h-40 bg-base-200 rounded-xl w-full" />
                <div className="h-4 bg-base-200 rounded w-1/3" />
                <div className="h-6 bg-base-200 rounded w-3/4" />
                <div className="h-4 bg-base-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="card border border-dashed border-base-300 bg-white p-12 text-center rounded-3xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={Calendar03Icon} size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0D154B] sm:text-xl">
              No Event Registrations Found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              {searchQuery
                ? `No registrations match your search "${searchQuery}". Try a different keyword.`
                : filter === "upcoming"
                  ? "You don't have any upcoming registered events scheduled right now."
                  : "You haven't registered for any events yet. Explore upcoming webinars, masterclasses, and conferences."}
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/events"
                className="btn btn-primary btn-md rounded-2xl text-sm font-bold text-white normal-case shadow-sm gap-2"
              >
                <span>Browse Upcoming Events</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredRegistrations.map((reg) => (
              <EventRegistrationCard
                key={reg.id}
                registration={reg}
                onViewPass={() => setSelectedTicketRegistration(reg)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ticket Pass Modal */}
      {selectedEventView && (
        <EventTicketModal
          isOpen={Boolean(selectedTicketRegistration)}
          onClose={() => setSelectedTicketRegistration(null)}
          event={selectedEventView}
          registration={selectedTicketRegistration}
          ticketNumber={selectedTicketRegistration?.ticketNumber}
        />
      )}
    </DashboardLayout>
  );
}

function EventRegistrationCard({
  registration,
  onViewPass,
}: {
  registration: EventRegistration;
  onViewPass: () => void;
}) {
  const event = registration.event;
  const isVirtual =
    event?.format === "Virtual" ||
    event?.location?.toLowerCase() === "online" ||
    Boolean(event?.meetingLink);

  const eventView: ChlpsEvent = useMemo(() => {
    if (event) {
      return transformEventApiToChlpsEvent(event);
    }
    return {
      id: registration.eventId || registration.id,
      title: "Professional Event",
      description: "CHLPS Event Registration",
      category: "Event",
      status: "upcoming",
      access: "free",
      date: formatEventDate(registration.registrationDate),
      time: "",
      duration: "",
      location: isVirtual ? "Online" : "In-Person",
      ticketPrice: "Free",
      image: Assets.images.upcomingEvent,
      imageAlt: "Event Banner",
      gallery: [],
      raw: event,
    } as ChlpsEvent;
  }, [event, registration, isVirtual]);

  const [imgSrc, setImgSrc] = useState(eventView.image);

  useEffect(() => {
    setImgSrc(eventView.image);
  }, [eventView.image]);

  // Status badge configuration
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

  const status = statusConfig[registration.status] || {
    label: registration.status,
    badgeClass: "badge-neutral text-white",
    icon: CheckmarkCircle02Icon,
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_36px_rgba(22,16,88,0.1)] ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-[0_16px_44px_rgba(22,16,88,0.14)]">
      {/* Top Banner Image with 16:10 aspect ratio matching public EventCard */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
        <Image
          src={imgSrc}
          alt={eventView.imageAlt}
          fill
          unoptimized
          onError={() => setImgSrc(Assets.images.upcomingEvent)}
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 sm:left-4 sm:top-4 flex flex-wrap items-center gap-2">
          <ImageOverlayBadge event={eventView} />
          <span
            className={`badge badge-sm text-xs font-bold gap-1 px-2.5 py-0.5 shadow-sm ${status.badgeClass}`}
          >
            <HugeiconsIcon icon={status.icon} size={12} />
            <span>{status.label}</span>
          </span>
        </div>
      </div>

      {/* Card Content with Certificate Backdrop */}
      <div className="relative flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <EventCardBackdrop />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A96]">
              {eventView.category}
            </p>
            <span className="badge badge-sm badge-ghost border border-base-300 font-mono text-xs font-bold text-primary">
              {registration.ticketNumber || `REG-${registration.id.slice(0, 8)}`}
            </span>
          </div>

          <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-[#161058] sm:text-lg lg:min-h-[3.2rem]">
            {eventView.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-xs sm:text-sm leading-relaxed text-base-content/70">
            {eventView.description}
          </p>

          <EventMeta event={eventView} className="mt-4" />

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col gap-2.5 lg:mt-auto lg:pt-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onViewPass}
                className="btn btn-outline btn-primary btn-sm flex-1 rounded-xl text-xs font-bold normal-case gap-1.5"
              >
                <HugeiconsIcon icon={Ticket01Icon} size={14} />
                <span>Digital Pass</span>
              </button>

              <Link
                href={`/dashboard/events/${registration.id}`}
                className="btn btn-primary btn-sm flex-1 rounded-xl text-xs font-bold text-white normal-case shadow-xs gap-1.5 flex items-center justify-center"
              >
                <span>View Details</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>

            {isVirtual && event?.meetingLink && registration.status !== "Cancelled" && (
              <a
                href={event.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-xs w-full text-xs text-primary font-semibold hover:bg-primary/10 gap-1 justify-center normal-case"
              >
                <span>Join Virtual Room</span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
