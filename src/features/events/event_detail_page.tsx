import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import EventDetailHeroSection from "@/features/events/components/event_detail_hero_section";
import EventDetailContent from "@/features/events/components/event_detail_content";
import type { ChlpsEvent } from "@/features/events/events_data";

type EventDetailPageProps = {
  event: ChlpsEvent;
};

export default function EventDetailPage({ event }: EventDetailPageProps) {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />
      <EventDetailHeroSection event={event} />

      <section className="py-8 sm:py-10 lg:py-12">
        <PageContainer>
          <Reveal>
            <Link
              href="/events"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#071649] px-5 text-[13px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 sm:text-sm"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
              />
              Back to Events
            </Link>
          </Reveal>

          <EventDetailContent event={event} />
        </PageContainer>
      </section>
      <Footer />
    </div>
  );
}
