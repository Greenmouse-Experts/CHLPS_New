import type { ChlpsEvent } from "@/features/events/events_data";

/**
 * Checks if an event has already ended or passed its scheduled date.
 */
export function isEventPassed(event: ChlpsEvent): boolean {
  if (event.status === "past") return true;

  const now = new Date();

  // Check raw backend EventItem dates
  if (event.raw) {
    const raw = event.raw;
    if (
      raw.status?.toLowerCase() === "completed" ||
      raw.status?.toLowerCase() === "past"
    ) {
      return true;
    }

    const targetDate = raw.endDate || raw.startDate;
    if (targetDate) {
      const timePart = raw.endTime || raw.startTime || "23:59:59";
      const formattedTime = timePart.length === 5 ? `${timePart}:00` : timePart;
      const endDateTime = new Date(`${targetDate}T${formattedTime}`);
      if (!isNaN(endDateTime.getTime())) {
        return now > endDateTime;
      }
    }
  }

  return false;
}

export function getEventDetailView(event: ChlpsEvent) {
  const isPast = isEventPassed(event);
  const isLive = !isPast && event.status === "live";
  const isFree = event.access === "free";
  const isVirtual = Boolean(
    event.location && event.location.trim().toLowerCase() === "online",
  );
  const typeLabel = isVirtual ? "Virtual Event" : event.category;

  return {
    isLive,
    isPast,
    isFree,
    isVirtual,
    typeLabel,
    canBuyTicket: !isPast,
    breadcrumb: `Events / ${typeLabel} / Event Details`,
    ticketPrice: event.ticketPrice,
    ticketNote: isPast
      ? "This event has ended. Ticket sales and registration are closed."
      : isFree
        ? "Free registration. Reserve your place."
        : `Ticket price: ${event.ticketPrice}`,
    ctaLabel: isPast ? "Event Ended" : isFree ? "Register Free" : "Buy Ticket",
    ctaHref: isPast ? "" : "/dashboard/register",
    placeLabel: isVirtual ? "Format" : "Location",
    placeValue: isVirtual
      ? "Online"
      : (event.address ?? event.location ?? "In-Person"),
  };
}
