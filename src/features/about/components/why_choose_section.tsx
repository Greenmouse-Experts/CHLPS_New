import type { CSSProperties } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  BookOpenCheckIcon,
  ChartHistogramIcon,
  CheckmarkBadge01Icon,
  Megaphone01Icon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

const benefits: {
  icon: IconSvgElement;
  title: string;
  body: string;
  tone: "sand" | "lilac";
}[] = [
  {
    icon: CheckmarkBadge01Icon,
    title: "Professional Recognition",
    body: "Structured membership and certification pathways provide credible recognition of competence and achievement.",
    tone: "sand",
  },
  {
    icon: BookOpenCheckIcon,
    title: "Education and Training",
    body: "Relevant education, specialist training, workshops and continuing professional development support changing risk environments.",
    tone: "sand",
  },
  {
    icon: UserGroupIcon,
    title: "Professional Community",
    body: "Members connect with peers, mentors, practitioners, employers, educators and other industry stakeholders.",
    tone: "lilac",
  },
  {
    icon: ChartHistogramIcon,
    title: "Career Development",
    body: "Professional resources, mentoring, certification pathways and leadership opportunities support progression at every stage.",
    tone: "sand",
  },
  {
    icon: ShieldCheckIcon,
    title: "Standards and Ethics",
    body: "Clear expectations for competence, integrity, confidentiality, accountability and ethical decision making strengthen trust.",
    tone: "sand",
  },
  {
    icon: Megaphone01Icon,
    title: "Professional Voice",
    body: "Advocacy, consultation, research and industry engagement strengthen recognition of loss prevention as a strategic discipline.",
    tone: "lilac",
  },
];

const toneClass = {
  sand: "bg-[#F5F4F0]",
  lilac: "bg-[#F1EEF9]",
} as const;

export default function WhyChooseSection() {
  return (
    <section id="why-choose-us" className="bg-white py-16 lg:py-20">
      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
          <div className="flex min-w-0 flex-col">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Why Choose Us
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.5rem]">
                Built for lasting development.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 max-w-[29rem] text-[15px] leading-relaxed text-[#676672] sm:text-base lg:mt-5">
                ChLPS Canada combines professional recognition, continuous
                learning, ethical standards, industry representation and a
                connected community around one progressive career pathway.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <Link
                href="/#membership"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 sm:text-sm lg:mt-7"
              >
                Explore membership
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={2}
                />
              </Link>
            </Reveal>
          </div>

          <RevealGroup className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
            {benefits.map((benefit, index) => (
              <article
                key={benefit.title}
                className={`reveal flex h-full flex-col rounded-2xl border border-[#CBB995] p-5 sm:p-6 ${toneClass[benefit.tone]}`}
                style={revealStyle(index)}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white sm:h-14 sm:w-14">
                  <HugeiconsIcon
                    icon={benefit.icon}
                    size={24}
                    color="#211A73"
                    strokeWidth={1.8}
                  />
                </span>

                <h3 className="mt-8 text-[17px] font-bold leading-tight tracking-tight text-[#151515] sm:mt-10 sm:text-lg lg:text-[1.375rem]">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-[14px] leading-relaxed text-[#747277] sm:text-[15px]">
                  {benefit.body}
                </p>
              </article>
            ))}
          </RevealGroup>
        </div>
      </PageContainer>
    </section>
  );
}
