import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const events = [
  {
    title: "Professional Conference",
    body: "Industry discussion, knowledge exchange and continuing professional development.",
    href: "#events-conference",
  },
  {
    title: "Specialist Workshop",
    body: "Practical sessions on investigation, risk analysis and operational loss prevention.",
    href: "#events-workshop",
  },
  {
    title: "Member Networking Session",
    body: "Meet peers, share practice insights and grow professional relationships.",
    href: "#events-networking",
  },
] as const;

function DateBadge() {
  return (
    <span className="flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-xl bg-lilac px-1.5 text-center sm:h-[5.25rem] sm:w-[5.25rem]">
      <span className="text-[10px] font-bold uppercase leading-[1.2] tracking-[0.04em] text-primary sm:text-[11px]">
        Date
        <br />
        to be
        <br />
        announced
      </span>
    </span>
  );
}

export default function UpcomingEventsSection() {
  return (
    <section id="events" className="bg-cream py-16 md:py-24">
      <PageContainer>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-xl">
            <Reveal>
              <span
                className="cut-tl inline-block bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                UPCOMING EVENTS
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-text sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.6rem]">
                Learn, connect and stay current with the profession.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140} className="max-w-md shrink-0 lg:pt-14">
            <p className="text-[15px] leading-relaxed text-text/70 sm:text-base lg:text-right">
              ChLPS Canada supports continuing professional development through
              conferences, seminars, workshops, professional meetings and
              networking activities.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6 xl:gap-8">
          <Reveal className="h-full min-h-[20rem]">
            <div className="relative h-full min-h-[20rem] overflow-hidden rounded-[1.5rem]">
              <Image
                src={Assets.images.upcomingEvent}
                alt="Professionals in a conference discussion"
                fill
                className="object-cover object-[center_20%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="inline-block bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#111E2A] sm:text-[11px]">
                  PROFESSIONAL DEVELOPMENT
                </span>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-[1.75rem]">
                  Professional Conference
                </h3>
                <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-white/90 sm:text-sm">
                  Industry discussion, knowledge exchange and continuing
                  professional development.
                </p>
              </div>
            </div>
          </Reveal>

          <RevealGroup className="flex flex-col gap-4">
            {events.map((event, index) => (
              <article
                key={event.title}
                className="reveal flex flex-1 items-center gap-4 rounded-2xl border border-secondary/35 bg-white p-4 shadow-[0_8px_24px_rgba(48,45,57,0.05)] sm:gap-5 sm:p-5"
                style={revealStyle(index)}
              >
                <DateBadge />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-bold leading-snug text-primary sm:text-base">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-text/60 sm:text-sm">
                    {event.body}
                  </p>
                </div>
                <Link
                  href={event.href}
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
            ))}
          </RevealGroup>
        </div>
      </PageContainer>
    </section>
  );
}
