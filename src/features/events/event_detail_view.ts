import type { ChlpsEvent } from "@/features/events/events_data";

export function getEventDetailView(event: ChlpsEvent) {
  const isLive = event.status === "live";
  const isFree = event.access === "free";
  const isVirtual = event.location.trim().toLowerCase() === "online";
  const typeLabel = isVirtual ? "Virtual Event" : event.category;

  return {
    isLive,
    isFree,
    isVirtual,
    typeLabel,
    breadcrumb: `Events / ${typeLabel} / Event Details`,
    ticketPrice: event.ticketPrice,
    ticketNote: isFree
      ? "Free registration. Reserve your place."
      : `Ticket price: ${event.ticketPrice}`,
    ctaLabel: isFree ? "Register Free" : "Buy Ticket",
    ctaHref: "/dashboard/register",
    placeLabel: isVirtual ? "Format" : "Location",
    placeValue: isVirtual
      ? "Online"
      : (event.address ?? event.location),
  };
}
