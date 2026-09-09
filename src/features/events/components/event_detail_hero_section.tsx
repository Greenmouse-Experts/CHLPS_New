import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import type { ChlpsEvent } from "@/features/events/events_data";
import { getEventDetailView } from "@/features/events/event_detail_view";

function HeroBadge({
  children,
  live = false,
}: {
  children: string;
  live?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1224]/55 px-3 py-1 text-[12px] font-medium text-white ring-1 ring-white/15 backdrop-blur-sm sm:px-3.5 sm:text-[13px]">
      {live ? (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3DDC84] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3DDC84]" />
        </span>
      ) : null}
      {children}
    </span>
  );
}

export default function EventDetailHeroSection({
  event,
}: {
  event: ChlpsEvent;
}) {
  const view = getEventDetailView(event);

  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#070B1C]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={Assets.images.eventDetailsHero}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[right_center]"
        />
      </div>

      <PageContainer className="relative h-full">
        <div className="flex h-full items-center py-10 sm:py-12 lg:min-h-[22rem] lg:py-16 xl:min-h-[26rem] xl:py-20">
          <div className="w-full">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <HeroBadge live={view.isLive}>{view.statusBadge}</HeroBadge>
                <HeroBadge>{view.formatLabel}</HeroBadge>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[2rem] font-light leading-[1.12] tracking-tight text-white sm:text-[48px] xl:leading-[1.08]">
                {event.title}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 max-w-[740px] text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5 lg:text-base xl:text-[20px]">
                {event.description}
              </p>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
