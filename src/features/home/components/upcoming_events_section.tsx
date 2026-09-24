"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  City03Icon,
  Location01Icon,
  OfficeIcon,
  UserGroup03Icon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";
import { fetchPublicEvents } from "@/features/events/services/event_service";
import { eventHref } from "@/features/events/components/event_ui";
import type { ChlpsEvent } from "@/features/events/events_data";

const MAX_EVENTS = 5;

const CATEGORY_ICONS: { match: RegExp; icon: IconSvgElement }[] = [
  { match: /conference|summit|forum|symposium|congress/i, icon: OfficeIcon },
  { match: /workshop|masterclass|seminar|training|course/i, icon: City03Icon },
  { match: /webinar|network|session|meeting|virtual/i, icon: UserGroup03Icon },
];

function getCategoryIcon(category?: string): IconSvgElement {
  if (category) {
    const found = CATEGORY_ICONS.find(({ match }) => match.test(category));
    if (found) return found.icon;
  }
  return Calendar03Icon;
}

function eventTimestamp(event: ChlpsEvent): number {
  const raw = event.raw;
  if (raw?.startDate) {
    const time = raw.startTime || "00:00:00";
    const parsed = new Date(`${raw.startDate}T${time}`).getTime();
    if (!Number.isNaN(parsed)) return parsed;
  }
  const fallback = new Date(event.date).getTime();
  return Number.isNaN(fallback) ? Number.MAX_SAFE_INTEGER : fallback;
}

function EventIconBadge({ icon }: { icon: IconSvgElement }) {
  return (
    <span className="flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-xl bg-lilac sm:h-[5.25rem] sm:w-[5.25rem]">
      <HugeiconsIcon icon={icon} size={36} color="#211A73" strokeWidth={1.8} />
    </span>
  );
}

function EventMetaLine({
  event,
  className = "",
}: {
  event: ChlpsEvent;
  className?: string;
}) {
  if (!event.date && !event.location) return null;

  return (
    <p
      className={`flex flex-wrap items-center gap-x-3 gap-y-1  font-medium text-[#686673] sm:text-[14px] ${className}`}
    >
      {event.date && (
        <span className="inline-flex items-center gap-1.5">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={15}
            color="#8B8B96"
            strokeWidth={1.8}
            className="shrink-0"
          />
          {event.date}
        </span>
      )}
      {event.location && (
        <span className="inline-flex items-center gap-1.5">
          <HugeiconsIcon
            icon={Location01Icon}
            size={15}
            color="#8B8B96"
            strokeWidth={1.8}
            className="shrink-0"
          />
          {event.location}
        </span>
      )}
    </p>
  );
}

function FeaturedEventCard({ event }: { event: ChlpsEvent }) {
  // Track the image that failed so we can fall back without a resync effect.
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imgSrc =
    failedImage === event.image ? Assets.images.upcomingEvent : event.image;

  return (
    <Reveal className="h-full min-h-[20rem]">
      <Link
        href={eventHref(event)}
        aria-label={`View ${event.title}`}
        className="group relative block h-full min-h-[20rem] overflow-hidden rounded-[1.5rem]"
      >
        <Image
          src={imgSrc}
          alt={event.imageAlt}
          fill
          unoptimized
          onError={() => setFailedImage(event.image)}
          className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <span
            className="cut-tl-br inline-block bg-secondary px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1C1662] sm:text-[20px]"
            style={{ "--cut": "0.55rem" } as CSSProperties}
          >
            {event.category}
          </span>
          <h3 className="mt-3 line-clamp-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-[45px]">
            {event.title}
          </h3>
          <p className="mt-1.5 max-w-md line-clamp-3  leading-relaxed text-white/90 sm:text-[18px]">
            {event.description}
          </p>
          {event.date && (
            <p className="mt-2 inline-flex items-center gap-2  font-medium text-white/80 sm:text-[15px]">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.8}
              />
              {event.date}
            </p>
          )}
        </div>
      </Link>
    </Reveal>
  );
}

function EventListCard({ event, index }: { event: ChlpsEvent; index: number }) {
  return (
    <article
      className="reveal flex flex-1 items-center gap-4 rounded-2xl border border-secondary/35 bg-white p-4 shadow-[0_8px_24px_rgba(48,45,57,0.05)] sm:gap-5 sm:p-5"
      style={revealStyle(index)}
    >
      <EventIconBadge icon={getCategoryIcon(event.category)} />
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[20px] font-medium leading-snug text-primary sm:text-[30px]">
          {event.title}
        </h3>
        <p className="mt-1 line-clamp-2  leading-relaxed text-[#686673] sm:text-[18px]">
          {event.description}
        </p>
        <EventMetaLine event={event} className="mt-2" />
      </div>
      <Link
        href={eventHref(event)}
        aria-label={`View ${event.title}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-[#111E2A] shadow-[0_6px_16px_rgba(205,165,78,0.35)] transition-transform hover:scale-[1.04] sm:h-12 sm:w-12"
      >
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={18}
          color="currentColor"
          strokeWidth={2}
        />
      </Link>
    </article>
  );
}

function UpcomingEventsSkeleton() {
  return (
    <div className="mt-10 grid items-stretch gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6 xl:gap-8">
      <div className="min-h-[20rem] animate-pulse rounded-[1.5rem] bg-primary/10" />
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex flex-1 items-center gap-5 rounded-2xl border border-secondary/35 bg-white p-5"
          >
            <div className="h-[4.75rem] w-[4.75rem] shrink-0 animate-pulse rounded-xl bg-primary/10 sm:h-[5.25rem] sm:w-[5.25rem]" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-primary/10" />
              <div className="h-3 w-full animate-pulse rounded bg-primary/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UpcomingEventsSection() {
  const query = useQuery({
    queryKey: ["public-events"],
    queryFn: fetchPublicEvents,
    staleTime: 5 * 60 * 1000,
  });

  const upcomingEvents = (query.data ?? [])
    .filter((event) => event.status === "upcoming")
    .sort((a, b) => eventTimestamp(a) - eventTimestamp(b))
    .slice(0, MAX_EVENTS);

  // Hide the section entirely when nothing is scheduled.
  if (!query.isLoading && upcomingEvents.length === 0) {
    return null;
  }

  const [featuredEvent, ...otherEvents] = upcomingEvents;

  return (
    <section id="events" className="bg-cream py-8 ">
      <PageContainer>
        <div className="flex items-center justify-center">
          <div className="max-w-5xl flex flex-col items-center justify-center">
            <HeaderText switch left="Upcoming" right="Events"></HeaderText>
            <HeaderSubText>
              Stay connected, informed, and professionally engaged through
              ChLPS-Canada events. Explore upcoming conferences, webinars,
              workshops, networking sessions, and professional development
              activities designed to expand your knowledge, strengthen industry
              connections, share emerging practices, and support your continued
              growth within the Loss Prevention and Asset Protection profession.
            </HeaderSubText>
          </div>
        </div>

        {query.isLoading ? (
          <UpcomingEventsSkeleton />
        ) : (
          <div
            className={`mt-10 grid items-stretch gap-5 lg:mt-12 lg:gap-6 xl:gap-8 ${
              otherEvents.length > 0 ? "lg:grid-cols-2" : ""
            }`}
          >
            {featuredEvent && <FeaturedEventCard event={featuredEvent} />}

            {otherEvents.length > 0 && (
              <RevealGroup className="flex flex-col gap-4">
                {otherEvents.map((event, index) => (
                  <EventListCard key={event.id} event={event} index={index} />
                ))}
              </RevealGroup>
            )}
          </div>
        )}
      </PageContainer>
    </section>
  );
}
