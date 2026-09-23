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
import HeaderText from "@/components/HeaderText";

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
    <section id="why-choose-us" className="py-16  derma">
      <PageContainer>
        <div className="grid gap-10  bg=[#F0EDF9] ">
          <div className="flex justify-center items-center text-center flex-col">
            <HeaderText left="Why" right="Choose Us" notCenter />
            <Reveal delay={160}>
              <p className="mt-4 max-w-[29rem]  leading-relaxed lg:mt-5">
                ChLPS Canada combines professional recognition, continuous
                learning, ethical standards, industry representation and a
                connected community around one progressive career pathway.
              </p>
            </Reveal>
          </div>
          <RevealGroup className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
            {benefits.map((benefit, index) => (
              <article
                key={benefit.title}
                className={`reveal flex h-full flex-col rounded-2xl border border-[#CDA54E] p-5 sm:p-6  text-center`}
                style={revealStyle(index)}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white sm:h-14 sm:w-14 mx-auto ring ring-secondary">
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

                <p className="mt-2 ">{benefit.body}</p>
              </article>
            ))}
          </RevealGroup>
          <Reveal delay={240} className="w-full flex flex-col">
            <Link
              href="/membership"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5  font-semibold text-white transition-opacity duration-200 hover:opacity-90 sm: lg:mt-7 mx-auto"
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
      </PageContainer>
    </section>
  );
}
