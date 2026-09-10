import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import PageContainer from "@/features/components/page_container";
import EventDetailContent from "@/features/events/components/event_detail_content";
import { getEventDetailView } from "@/features/events/event_detail_view";
import type { ChlpsEvent } from "@/features/events/events_data";

type EventDetailPageProps = {
  event: ChlpsEvent;
};

export default function EventDetailPage({ event }: EventDetailPageProps) {
  const view = getEventDetailView(event);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <section className="pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-24 lg:pt-10">
        <PageContainer>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#071649] transition-opacity hover:opacity-70 sm:text-[14px]"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
              />
              Back to Events
            </Link>
            <p className="text-[12px] text-[#81889C] sm:text-[20px]">
              {view.breadcrumb}
            </p>
          </div>

          <EventDetailContent event={event} />
        </PageContainer>
      </section>
      <Footer />
    </div>
  );
}
