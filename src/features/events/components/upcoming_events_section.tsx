import { Calendar03Icon } from "@hugeicons/core-free-icons";
import PageContainer from "@/features/components/page_container";
import EventSectionHeader from "@/features/events/components/event_section_header";
import { EventCardGrid } from "@/features/events/components/event_card";
import { getEventsByStatus } from "@/features/events/events_data";

export default function UpcomingEventsSection() {
  const upcomingEvents = getEventsByStatus("upcoming");

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section id="upcoming-events" className="bg-white pb-14 md:pb-16 lg:pb-20">
      <PageContainer>
        <EventSectionHeader
          icon={Calendar03Icon}
          iconColor="#6B65C4"
          title="Upcoming Events"
          subtitle="Explore what is coming next."
          viewAllHref="#upcoming-events"
        />
        <EventCardGrid events={upcomingEvents} />
      </PageContainer>
    </section>
  );
}
