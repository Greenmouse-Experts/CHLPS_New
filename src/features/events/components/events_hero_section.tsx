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
          <div className="w-full max-w-[38rem] xl:max-w-[46rem]">
            <Reveal>
              <h1
                className={`font-normal leading-[1.08] tracking-tight text-white ${
                  compact
                    ? "text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] xl:text-[3.5rem] xl:leading-[1.08]"
                    : "text-[2.5rem] sm:text-[3.25rem] lg:text-[4.25rem] xl:text-[5rem] xl:leading-[1.04]"
                }`}
              >
                {title}
              </h1>
            </Reveal>

            <Reveal delay={80}>
              <p
                className={`mt-3 font-medium leading-snug text-white sm:mt-4 ${
                  compact
                    ? "max-w-[36rem] text-[15px] sm:text-base lg:text-[18px]"
                    : "max-w-[34rem] text-[15px] sm:text-lg lg:text-[22px] xl:text-[24px]"
                }`}
              >
                {body}
              </p>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
