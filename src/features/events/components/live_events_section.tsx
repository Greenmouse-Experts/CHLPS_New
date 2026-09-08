import Image from "next/image";
import { Wifi01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import EventSectionHeader from "@/features/events/components/event_section_header";
import {
  AccessBadge,
  EventCardBackdrop,
  EventMeta,
  ImageOverlayBadge,
  ViewDetailsButton,
  eventHref,
} from "@/features/events/components/event_ui";
import { getEventsByStatus } from "@/features/events/events_data";

export default function LiveEventsSection() {
  const liveEvents = getEventsByStatus("live");

  if (liveEvents.length === 0) {
    return null;
  }

  return (
    <section id="live-events" className="bg-white py-14 md:py-16 lg:py-20 ">
      <PageContainer>
        <EventSectionHeader
          icon={Wifi01Icon}
          iconColor="#E45C4A"
          iconBg="#FFF0F0"
          title="Live Events"
          subtitle="Happening now."
          action={
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0F0] px-3.5 py-1.5 text-[13px] font-medium text-[#E23B3B]  ring-1 ring-black/5 sm:px-4 sm:py-2 sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E23B3B] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E23B3B]" />
              </span>
              Live Now
            </span>
          }
        />

        <div className="mt-8 flex flex-col gap-6 lg:mt-10">
          {liveEvents.map((event) => (
            <Reveal key={event.id}>
              <article className="grid overflow-hidden rounded-[16px] bg-[#F6FBF8] border border-[#CDA54E40] shadow-[0_12px_36px_rgba(22,16,88,0.1)] ring-1 ring-black/[0.04] lg:grid-cols-[minmax(17rem,0.42fr)_minmax(0,1fr)]">
                <div className="relative min-h-[14rem] sm:min-h-[16rem] lg:min-h-[17.5rem]">
                  <Image
                    src={event.image}
                    alt={event.imageAlt}
                    fill
                    className={event.imageClassName ?? "object-cover"}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                    <ImageOverlayBadge event={event} />
                  </div>
                </div>

                <div className="relative flex flex-col overflow-hidden px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7">
                  <EventCardBackdrop sizes="(max-width: 1024px) 100vw, 58vw" />

                  <div className="relative z-10 flex h-full flex-col">
                    <AccessBadge access={event.access} className="w-fit" />

                    <h3 className="mt-3 text-[1.35rem] font-bold leading-snug tracking-tight text-[#071649] sm:text-[1.6rem] lg:text-[31px]">
                      {event.title}
                    </h3>

                    <p className="mt-2 max-w-[40rem] text-[14px] leading-relaxed text-[#333041] sm:text-[15px] lg:text-[17px]">
                      {event.description}
                    </p>

                    <EventMeta event={event} className="mt-5 max-w-[32rem]" />

                    <div className="mt-6 flex flex-wrap items-end justify-between gap-4 lg:mt-auto lg:pt-6">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8A96]">
                          Ticket
                        </p>
                        <p
                          className={`mt-0.5 text-[15px] font-bold sm:text-[22px] ${
                            event.access === "free"
                              ? "text-[#2FA360]"
                              : "text-primary"
                          }`}
                        >
                          {event.access === "free" ? "Free" : "Paid"}
                        </p>
                      </div>

                      <ViewDetailsButton href={eventHref(event)} />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
