import type { ChlpsEvent } from "@/features/events/events_data";

/**
 * Checks if an event has already ended or passed its date/registration window.
 */
export function isEventPassed(event: ChlpsEvent): boolean {
  if (event.status === "past") return true;

  const now = new Date();

  // 1. Check raw backend EventItem fields if available
  if (event.raw) {
    if (
      event.raw.status?.toLowerCase() === "completed" ||
      event.raw.status?.toLowerCase() === "past"
    ) {
      return true;
    }

    if (event.raw.registrationCloses) {
      const regClose = new Date(event.raw.registrationCloses);
      if (!isNaN(regClose.getTime()) && now > regClose) {
        return true;
      }
    }

    const targetDateStr = event.raw.endDate || event.raw.startDate;
    if (targetDateStr) {
      try {
        if (targetDateStr.includes("T")) {
          const parsed = new Date(targetDateStr);
          if (!isNaN(parsed.getTime())) {
            return now > parsed;
          }
        } else {
          const timeStr = event.raw.endTime || event.raw.startTime;
          const timePart = timeStr
            ? `T${timeStr.length === 5 ? timeStr + ":00" : timeStr}`
            : "T23:59:59";
          const parsed = new Date(`${targetDateStr}${timePart}`);
          if (!isNaN(parsed.getTime())) {
            return now > parsed;
          }
        }
      } catch {
        // Continue to fallback checks
      }
    }
  }

  // 2. Fallback: Parse display date string (e.g. "07 Sep 2026", "15 Sep 2026 - 16 Sep 2026")
  if (event.date) {
    try {
      const parts = event.date.split("-").map((p) => p.trim());
      const lastDate = parts[parts.length - 1];
      const parsed = new Date(lastDate);

      if (!isNaN(parsed.getTime())) {
        let endHours = 23;
        let endMinutes = 59;
        let endSeconds = 59;

        if (event.time) {
          const timeParts = event.time.split("-").map((p) => p.trim());
          const lastTime = timeParts[timeParts.length - 1];
          const match = lastTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
          if (match) {
            let h = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const ampm = match[3]?.toUpperCase();
            if (ampm === "PM" && h < 12) h += 12;
            if (ampm === "AM" && h === 12) h = 0;
            endHours = h;
            endMinutes = m;
            endSeconds = 0;
          }
        }

        parsed.setHours(endHours, endMinutes, endSeconds, 999);
        return now > parsed;
      }
    } catch {
      // Ignore date parse errors
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
