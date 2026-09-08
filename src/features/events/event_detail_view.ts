import type { ChlpsEvent } from "@/features/events/events_data";

export function getEventDetailView(event: ChlpsEvent) {
  const isLive = event.status === "live";
  const isPast = event.status === "past";
  const isFree = event.access === "free";
  const isVirtual = event.location.trim().toLowerCase() === "online";

  return {
    isLive,
    isPast,
    isFree,
    isVirtual,
    accentBg: isLive ? "#FFF0F0" : "#F6F3FB",
    formatLabel: isVirtual ? "Virtual Event" : "In-person Event",
    statusBadge: isLive ? "Live" : isPast ? "Past" : "Upcoming",
    statusLabel: isLive
      ? "Live event"
      : isPast
        ? "Past event"
        : "Upcoming event",
    attendanceType: isFree ? "Free access" : "Paid access",
    availability: isPast
      ? "Registration closed"
      : "Available for registration",
    registrationStatus: isPast ? "Closed" : "Open",
    capacity: "300",
    registered: "135",
    checkIns: "83",
    registrationNote: isPast
      ? "This event has ended."
      : "Registration is currently open for active attendees",
    ticketType: isFree ? "Free" : "Paid",
    confirmation: "Issued by email after registration",
    accessDetail: isVirtual
      ? "Virtual access link shared by email"
      : "Venue details shared by email after registration",
    support: "events@chipscanada.org",
    ticketPrice: isFree ? "Free" : "Paid",
    salesMode: isFree ? "Free entry" : "Paid entry",
    paymentMode: isFree ? "No payment required" : "Payment required",
    collected: "N/A",
    refunds: "Not applicable",
    paymentNote: isFree
      ? "This event is free to attend."
      : "Payment details will be confirmed at registration.",
  };
}
