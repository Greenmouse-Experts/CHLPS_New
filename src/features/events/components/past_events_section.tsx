import { HistoryIcon } from "@hugeicons/core-free-icons";
import PageContainer from "@/features/components/page_container";
import EventSectionHeader from "@/features/events/components/event_section_header";
import { EventCardGrid } from "@/features/events/components/event_card";
import { getEventsByStatus } from "@/features/events/events_data";

export default function PastEventsSection() {
  const pastEvents = getEventsByStatus("past");

  if (pastEvents.length === 0) {
    return null;
  }

  return (
    <section
      id="past-events"
      className="bg-[#F3F5F8] py-14 md:py-16 lg:py-20"
    >
      <PageContainer>
        <EventSectionHeader
          icon={HistoryIcon}
          iconColor="#6B7C93"
          title="Past Events"
          subtitle="Explore previous CHLPS events."
          viewAllHref="#past-events"
        />
        <EventCardGrid events={pastEvents} />
      </PageContainer>
    </section>
  );
}
