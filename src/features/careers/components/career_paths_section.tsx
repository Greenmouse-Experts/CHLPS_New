import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import {
  careerActions,
  careerPaths,
  type CareerPath,
} from "@/features/careers/careers_data";
import HeaderText from "@/components/HeaderText";

function CareerPathCard({
  career,
  index,
}: {
  career: CareerPath;
  index: number;
}) {
  const Icon = career.icon;
  const action = careerActions[career.action];
  const tinted = index % 3 === 1;

  return (
    <article
      className="reveal group flex h-full flex-col rounded-[14px] border border-[#E8D9B8] px-5 pb-5 pt-6 transition-shadow duration-300 hover:shadow-[0_14px_34px_rgba(33,26,115,0.08)] sm:px-6 sm:pb-6"
      style={{
        ...revealStyle(index),
        backgroundColor: tinted ? "#F7F5FC" : "#FFFFFF",
      }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary bg-white sm:h-14 sm:w-14">
        <Icon
          size={22}
          strokeWidth={1.8}
          className="text-primary"
          aria-hidden
        />
      </span>

      <div className="mt-5 border-t border-[#EFE7D6]" />

      <h3 className="mt-5 text-[1rem] font-semibold leading-snug tracking-tight text-primary sm:text-[1.0625rem]">
        {career.title}
      </h3>

      <p className="mt-2  leading-relaxed  sm:">{career.body}</p>

      <Link
        href={action.href}
        className="mt-6 flex items-center justify-between gap-3 pt-1 lg:mt-auto lg:pt-6"
      >
        <span className=" font-bold text-primary sm:text-[14px]">
          {action.label}
        </span>
        <ArrowRight
          size={18}
          strokeWidth={2}
          className="shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </article>
  );
}

export default function CareerPathsSection() {
  return (
    <section id="career-paths" className="bg-white py-14 sm:py-8 ">
      <PageContainer>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal delay={80}>
            <HeaderText left="Explore Career " right="Paths" />
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-3 max-w-[640px] text-[14px] leading-relaxed  sm:text-[15px]">
              Explore a broad range of professional roles that support loss
              prevention, asset protection, investigations, governance, risk and
              business resilience.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-9 grid grid-cols-1 items-stretch gap-5 sm:mt-10 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {careerPaths.map((career, index) => (
            <CareerPathCard key={career.title} career={career} index={index} />
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
