"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import LeaderProfileModal from "@/features/about/components/leader_profile_modal";
import { leaders, type Leader } from "@/features/about/data/leadership";

export default function LeadershipSection() {
  const [activeLeader, setActiveLeader] = useState<Leader | null>(null);

  return (
    <section id="leadership" className="bg-[#F4F3F8] py-16 lg:py-20">
      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span
              className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs"
              style={{ "--cut": "0.55rem" } as CSSProperties}
            >
              Leadership
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-5 max-w-[13em] text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.5rem]">
              Leadership built on standards and service.
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-4 max-w-[34rem] text-[15px] leading-relaxed text-[#676672] sm:text-base">
              The governance page identifies the following leaders responsible
              for Board oversight and executive management within ChLPS Canada.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {leaders.map((leader, index) => (
            <button
              key={leader.id}
              type="button"
              onClick={() => setActiveLeader(leader)}
              aria-label={`View profile of ${leader.name}`}
              className="reveal group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white text-left transition-shadow duration-200 hover:shadow-[0_18px_40px_-24px_rgba(33,26,115,0.45)]"
              style={revealStyle(index)}
            >
              <div className="relative aspect-[10/9] w-full overflow-hidden">
                <Image
                  src={leader.photo}
                  alt={`${leader.name}, ${leader.role}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover object-[center_10%] transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span
                  className="cut-tr-bl inline-block self-start bg-secondary px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-primary sm:text-[10px]"
                  style={{ "--cut": "0.4rem" } as CSSProperties}
                >
                  {leader.role}
                </span>

                <h3 className="mt-3 text-[1.25rem] font-medium leading-tight tracking-tight text-[#151528] sm:text-[1.375rem]">
                  {leader.name}
                </h3>

                <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#6B6785]">
                  {leader.credentials.join(" · ")}
                </p>

                <p className="mt-3 text-[12px] leading-relaxed text-[#7E7A8A] sm:text-[13px]">
                  {leader.summary}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#F1EFF5] pt-4">
                  <span className="text-[12px] font-semibold text-primary sm:text-[13px]">
                    View profile
                  </span>
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    size={16}
                    color="#D1B983"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </button>
          ))}
        </RevealGroup>
      </PageContainer>

      {activeLeader ? (
        <LeaderProfileModal
          leader={activeLeader}
          onClose={() => setActiveLeader(null)}
        />
      ) : null}
    </section>
  );
}
