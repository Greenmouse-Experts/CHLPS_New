import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import EventsHeroSection from "@/features/events/components/events_hero_section";
import LiveEventsSection from "@/features/events/components/live_events_section";
import UpcomingEventsSection from "@/features/events/components/upcoming_events_section";
import PastEventsSection from "@/features/events/components/past_events_section";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <EventsHeroSection />
      <LiveEventsSection />
      <UpcomingEventsSection />
      <PastEventsSection />
      <Footer />
    </div>
  );
}
