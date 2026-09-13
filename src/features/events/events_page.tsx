"use client";

import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import EventsHeroSection from "@/features/events/components/events_hero_section";
import LiveEventsSection from "@/features/events/components/live_events_section";
import UpcomingEventsSection from "@/features/events/components/upcoming_events_section";
import PastEventsSection from "@/features/events/components/past_events_section";
import QueryCompLayout from "@/components/QueryCompLayout";
import { fetchPublicEvents } from "@/features/events/services/event_service";
import type { ChlpsEvent } from "@/features/events/events_data";

type EventsPageProps = {
  initialEvents?: ChlpsEvent[];
};

export default function EventsPage({ initialEvents }: EventsPageProps) {
  const query = useQuery({
    queryKey: ["public-events"],
    queryFn: fetchPublicEvents,
    initialData: initialEvents,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const emptyState = (
    <div className="mx-auto my-20 max-w-lg rounded-2xl border border-dashed border-[#D2CEDF] bg-white p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F5F8] text-[#161058]">
        <HugeiconsIcon icon={Calendar03Icon} size={28} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#161058]">
        No Events Scheduled
      </h3>
      <p className="mt-2 text-sm text-[#6F6E7A]">
        There are currently no events published. Please check back soon for
        upcoming sessions and conferences.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <EventsHeroSection />

      <QueryCompLayout
        query={query}
        loadingText="Loading events..."
        emptyState={emptyState}
      >
        {(events) => {
          const list = events || [];
          if (list.length === 0) {
            return emptyState;
          }

          const liveEvents = list.filter((e) => e.status === "live");
          const upcomingEvents = list.filter((e) => e.status === "upcoming");
          const pastEvents = list.filter((e) => e.status === "past");

          return (
            <>
              {liveEvents.length > 0 && (
                <LiveEventsSection events={liveEvents} />
              )}
              {upcomingEvents.length > 0 && (
                <UpcomingEventsSection events={upcomingEvents} />
              )}
              {pastEvents.length > 0 && (
                <PastEventsSection events={pastEvents} />
              )}
            </>
          );
        }}
      </QueryCompLayout>

      <Footer />
    </div>
  );
}
