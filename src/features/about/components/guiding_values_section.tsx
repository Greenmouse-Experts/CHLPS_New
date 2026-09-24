import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

export default function GuidingValuesSection() {
  return (
    <section
      id="values"
      className="overflow-x-clip bg-white pt-16 sm:pt-20 lg:pt-24"
    >
      <PageContainer>
        <div className="mx-auto flex flex-col items-center mb-5 text-center">
          <Reveal>
            <h2 className="text-[1.125rem] font-medium uppercase leading-snug tracking-[0.12em] sm:text-[1.375rem] lg:text-[40px] capitalize">
              <span className="text-secondary">Our six core</span>{" "}
              <span className="text-primary">guiding values</span>
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <p className="mt-5 max-w-[940px] font-medium text-[14px] leading-[1.8] text-[#130F44] sm:text-[18px] lg:text-[20px]">
              Our six core values define who we are, how we serve, and the
              standards we uphold. They guide our decisions, shape our
              professional conduct, and strengthen our commitment to advancing
              Loss Prevention through integrity, excellence, professionalism,
              collaboration, innovation, and continuous development across
              Canada and the wider professional community.
            </p>
          </Reveal>
        </div>
      </PageContainer>

      <Reveal
        delay={140}
        className="mx-auto w-full max-w-[var(--max-width-page)]"
      >
        <Image
          src={Assets.images.guidingValues}
          alt="Six guiding values of ChLPS Canada: Integrity, Confidentiality, Fairness, Accountability, Objectivity, and Respect for the Law"
          width={1728}
          height={1086}
          quality={90}
          sizes="100vw"
          className="block h-auto w-full"
        />
      </Reveal>
    </section>
  );
}
