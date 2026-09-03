import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  BookOpen01Icon,
  ChartHistogramIcon,
  CheckmarkBadge01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const features: {
  icon: IconSvgElement;
  title: string;
  body: string;
}[] = [
  {
    icon: UserGroupIcon,
    title: "Professional Network",
    body: "Connect with loss prevention specialists, security leaders, investigators, risk practitioners, consultants and industry peers.",
  },
  {
    icon: CheckmarkBadge01Icon,
    title: "Credible Recognition",
    body: "Build professional standing through membership and certification grounded in competence and ethics.",
  },
  {
    icon: BookOpen01Icon,
    title: "Continuous Learning",
    body: "Access training, workshops, seminars, professional resources and continuing development designed for changing risk environments.",
  },
  {
    icon: ChartHistogramIcon,
    title: "Career Progression",
    body: "Progress through clear professional pathways, from foundational competence to leadership and executive roles.",
  },
];

export default function WhyJoinSection() {
  return (
    <section id="why-join" className="bg-cream py-16 md:py-24">
      <PageContainer>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex min-w-0 flex-col">
            <Reveal>
              <span
                className="cut-bl inline-block bg-[#6B65C4] px-3 py-1.5 text-[11px] sm:text-[20px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                WHY JOIN CHLPS CANADA
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
                For professionals ready to grow.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 max-w-[612px] text-[15px] leading-relaxed text-[#383740] sm:text-[24px] lg:mt-5">
                ChLPS Canada connects professional recognition with the
                knowledge, standards, community and development opportunities
                needed to grow from entry-level practice into leadership.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-8 lg:mt-10">
              <div className="mt-auto w-full pb-3.5 pr-3.5">
                <div className="shadow-[12px_12px_0_0_#111111] sm:shadow-[14px_14px_0_0_#111111]">
                  <Image
                    src={Assets.images.whyJoin}
                    alt="Two loss prevention professionals reviewing analytics on a tablet"
                    width={1408}
                    height={768}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="reveal flex flex-col rounded-[1.25rem] bg-white p-6 shadow-[0_8px_24px_rgba(48,45,57,0.05)] sm:p-7 border border-[#CDA54E]"
                style={revealStyle(index)}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sand border border-[#BDB6BDCE]">
                  <HugeiconsIcon
                    icon={feature.icon}
                    size={22}
                    color="#211A73"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="mt-5 text-[25px] font-bold text-[#151515] leading-tight tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[16px] leading-tight text-[#676672] sm:text-[20px]">
                  {feature.body}
                </p>
              </article>
            ))}
          </RevealGroup>
        </div>
      </PageContainer>
    </section>
  );
}
