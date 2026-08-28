import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Bookmark02Icon,
  GraduationCapIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const pathwayIcons = [
  { icon: ShieldCheckIcon, label: "Membership" },
  { icon: GraduationCapIcon, label: "Certification" },
  { icon: UserGroupIcon, label: "Professional development" },
] as const;

function PathwayCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border-2 border-white bg-secondary px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.22)] sm:gap-5 sm:px-6 sm:py-5 ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2">
        {pathwayIcons.map(({ icon, label }) => (
          <span
            key={label}
            title={label}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white sm:h-10 sm:w-10"
          >
            <HugeiconsIcon
              icon={icon}
              size={18}
              color="#111E2A"
              strokeWidth={1.8}
            />
          </span>
        ))}
      </div>
      <div className="min-w-0 text-[#111E2A]">
        <p className="text-[13px] font-bold leading-snug sm:text-sm">
          Membership. Certification. Professional development.
        </p>
        <p className="mt-0.5 text-[12px] leading-snug sm:text-[13px]">
          One progressive career pathway.
        </p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#111E2A] ">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={Assets.images.heroBg}
          alt="CHLPS professionals standing together"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[right_center]"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="flex items-center py-10 sm:py-12 lg:min-h-[38rem] lg:py-16 xl:min-h-[42rem] xl:py-20">
          <div className="w-full max-w-[34rem] xl:max-w-[38rem]">
            <Reveal>
              <span
                className="cut-tr inline-block bg-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#111E2A]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                CHLPS CANADA
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[2rem] font-normal leading-[1.12] tracking-tight text-white sm:text-4xl lg:mt-6 lg:text-[2.75rem] xl:text-[3.35rem] xl:leading-[1.08]">
                Advancing excellence in
                <br />
                <span className="text-secondary">loss prevention.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-6 lg:text-lg">
                Supporting professionals through recognized membership, credible
                certification and continuous development built for today&apos;s
                evolving loss prevention landscape.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="#membership"
                  className="cut-tr inline-flex h-12 items-center gap-2 bg-secondary px-6 text-[13px] font-semibold text-[#111E2A] transition-all duration-200 hover:brightness-95 sm:text-sm"
                  style={{ "--cut": "0.85rem" } as CSSProperties}
                >
                  Explore Membership
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={2}
                  />
                </Link>
                <Link
                  href="#certification"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/85 px-6 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-white/10 sm:text-sm"
                >
                  View Certifications
                  <HugeiconsIcon
                    icon={Bookmark02Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={2}
                  />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320} className="mt-8 lg:hidden">
              <PathwayCard />
            </Reveal>
          </div>
        </div>
      </PageContainer>

      <Reveal
        delay={280}
        className="pointer-events-none absolute bottom-8 right-6 z-10 hidden lg:block xl:bottom-10 xl:right-10 2xl:right-14"
      >
        <div className="pointer-events-auto max-w-[28rem]">
          <PathwayCard />
        </div>
      </Reveal>
    </section>
  );
}
