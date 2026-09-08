import Image from "next/image";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import {
  EventCardBackdrop,
  EventMeta,
  ImageOverlayBadge,
  ViewDetailsButton,
  eventHref,
} from "@/features/events/components/event_ui";
import type { ChlpsEvent } from "@/features/events/events_data";

export default function EventCard({
  event,
  index = 0,
}: {
  event: ChlpsEvent;
  index?: number;
}) {
  return (
    <article
      className="reveal flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_12px_36px_rgba(22,16,88,0.1)] ring-1 ring-black/[0.04]"
      style={revealStyle(index)}
    >
      <div className="relative aspect-[16/10] w-full shrink-0">
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          className={event.imageClassName ?? "object-cover"}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
          <ImageOverlayBadge event={event} />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <EventCardBackdrop />

        <div className="relative z-10 flex flex-1 flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8A96]">
            {event.category}
          </p>

          <h3 className="mt-2 text-[1.15rem] font-semibold leading-snug tracking-tight text-[#161058] sm:text-[1.25rem] lg:min-h-[3.4rem] lg:text-[1.35rem]">
            {event.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#6F6E7A] sm:text-[15px]">
            {event.description}
          </p>

          <EventMeta event={event} className="mt-4" />

          <div className="mt-5 lg:mt-auto lg:pt-5">
            <ViewDetailsButton href={eventHref(event)} fullWidth />
          </div>
        </div>
      </div>
    </article>
  );
}

export function EventCardGrid({ events }: { events: ChlpsEvent[] }) {
  return (
    <RevealGroup className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:mt-10 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </RevealGroup>
  );
}
