import type { Metadata } from "next";
import EventsPage from "@/features/events/events_page";
import { fetchPublicEvents } from "@/features/events/services/event_service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Events | CHLPS Canada",
  description:
    "Discover CHLPS Canada events that connect and advance loss prevention professionals — live sessions, upcoming programmes and past recordings.",
};

export default async function Events() {
  const initialEvents = await fetchPublicEvents().catch(() => []);
  return <EventsPage initialEvents={initialEvents} />;
}
