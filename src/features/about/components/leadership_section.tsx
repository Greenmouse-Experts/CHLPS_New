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
import HeaderText from "@/components/HeaderText";

export default function LeadershipSection() {
  const [activeLeader, setActiveLeader] = useState<Leader | null>(null);

  return (
    <section id="leadership" className="bg-[#F4F3F8] py-8  ">
      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <Reveal delay={80}>
            <h2 className="mt-5 max-w-[13em] text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.5rem]">
              <span className="text-primary">Leadership built on </span> <br />
              <span className="text-secondary">standards and service.</span>
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-4 max-w-[34rem] text-[15px] leading-relaxed  sm:text-base">
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
                  className="origin-top object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="text-primary font-semibold">
                  {leader.role}
                </span>

                <h3 className="mt-3 text-[1.25rem] font-medium leading-tight tracking-tight text-[#151528] sm:text-[1.375rem]">
                  {leader.name}
                </h3>

                <p className="mt-3  font-medium leading-relaxed text-[#6B6785]">
                  {leader.credentials.join(" · ")}
                </p>

                <p className="mt-3  leading-relaxed text-[#7E7A8A] sm:">
                  {leader.summary}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#F1EFF5] pt-4">
                  <span className=" font-semibold text-primary sm:">
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
