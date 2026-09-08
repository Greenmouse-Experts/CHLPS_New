import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type StageTone = "lilac" | "gold" | "navy";

const stages: {
  number: string;
  title: string;
  body: string;
  tone: StageTone;
}[] = [
  {
    number: "01",
    title: "Starting your career",
    body: "For students and people beginning to explore loss prevention and asset protection.",
    tone: "lilac",
  },
  {
    number: "02",
    title: "Building experience",
    body: "For developing practitioners strengthening skills, knowledge and professional direction.",
    tone: "gold",
  },
  {
    number: "03",
    title: "Strengthening professional standing",
    body: "For experienced professionals seeking recognition, certification and continued development.",
    tone: "navy",
  },
  {
    number: "04",
    title: "Leading people and organisations",
    body: "For senior practitioners and organisations building stronger loss prevention capability.",
    tone: "lilac",
  },
];

const toneClass: Record<StageTone, string> = {
  lilac: "bg-[#EEEAF8] text-[#161058]",
  gold: "bg-[#CDA54E] text-[#161058]",
  navy: "bg-[#161058] text-white",
};

export default function WhoShouldJoinSection() {
  return (
    <section
      id="who-should-join"
      className="relative overflow-hidden bg-white py-16 lg:py-20"
    >
      <PageContainer className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12 xl:gap-16">
          <Reveal className="h-full min-h-[22rem] min-w-0 sm:min-h-[28rem]">
            <div className="relative h-full overflow-hidden rounded-bl-[1.75rem] rounded-br-[1.75rem]">
              <Image
                src={Assets.images.whoShouldJoin}
                alt="Professional working with colleagues in a modern office"
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover object-[center_20%]"
              />

              <div className="cut-tr-bl absolute bottom-5 left-5 w-[min(calc(100%-2.5rem),17.5rem)] bg-secondary p-4 text-[#161058] sm:bottom-7 sm:left-7 sm:p-5">
                <h3 className="text-[20px] font-bold text-[#211A73] leading-tight sm:text-[32px]">
                  Your path
                </h3>
                <p className="mt-1.5 text-[11px] font-bold text-[#211A73] leading-snug sm:text-[11px]">
                  Membership designed to grow with your professional journey.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex min-w-0 flex-col">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Who Should Join?
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
                For professionals at every stage.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 max-w-[36rem] text-[15px] leading-relaxed text-[#5B5A66] sm:text-base lg:mt-5">
                Whether you are discovering the profession, building practical
                experience, strengthening your standing or leading teams, ChLPS
                Canada provides a membership route designed around your stage of
                development.
              </p>
            </Reveal>

            <RevealGroup className="mt-6 flex flex-col gap-3 lg:mt-7">
              {stages.map((stage, index) => {
                const isNavy = stage.tone === "navy";

                return (
                  <article
                    key={stage.number}
                    className={`reveal flex items-start gap-3.5 rounded-2xl px-4 py-4 sm:gap-4 sm:px-5 sm:py-[1.15rem] ${toneClass[stage.tone]}`}
                    style={revealStyle(index)}
                  >
                    <span className="shrink-0 text-[1.25rem] font-bold leading-none sm:text-[1.5rem]">
                      {stage.number}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-[15px] font-bold leading-tight sm:text-[18px]">
                        {stage.title}
                      </h3>
                      <p
                        className={`mt-1 text-[13px] leading-relaxed sm:text-[14px] ${
                          isNavy ? "text-white/80" : "opacity-80"
                        }`}
                      >
                        {stage.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </RevealGroup>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
