import type { Metadata } from "next";
import EventsPage from "@/features/events/events_page";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover CHLPS Canada events that connect and advance loss prevention professionals — live sessions, upcoming programmes and past recordings.",
};

export default function Events() {
  return <EventsPage />;
}
