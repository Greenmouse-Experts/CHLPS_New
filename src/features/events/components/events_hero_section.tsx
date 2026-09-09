import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type EventsHeroSectionProps = {
  title?: string;
  body?: string;
  compact?: boolean;
};

export default function EventsHeroSection({
  title = "Events",
  body = "Discover events that connect and advance professionals.",
  compact = false,
}: EventsHeroSectionProps) {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#000E21]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={Assets.images.eventHero}
          alt="CHLPS Canada professionals standing together"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[right_center]"
        />
      </div>

      <PageContainer className="relative h-full">
        <div
          className={`flex h-full items-center py-10 sm:py-12 ${
            compact
              ? "lg:min-h-[22rem] lg:py-14 xl:min-h-[24rem] xl:py-16"
              : "lg:min-h-[28rem] lg:py-16 xl:min-h-[32rem] xl:py-20"
          }`}
        >
          <div className="w-full">
            <Reveal>
              <h1 className="text-[2rem] font-light leading-[1.12] tracking-tight text-white sm:text-[48px] xl:leading-[1.08]">
                {title}
              </h1>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-4 max-w-[740px] text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5 lg:text-base xl:text-[20px]">
                {body}
              </p>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
