"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Bookmark02Icon,
  GraduationCapIcon,
  Share07Icon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const SLIDE_MS = 6000;
const FADE_MS = 1400;

type HeroSlide = {
  image: string;
  alt: string;
  title: string;
  accent: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string; icon: IconSvgElement };
};

const heroSlides: HeroSlide[] = [
  {
    image: Assets.images.heroBg1,
    alt: "CHLPS professionals standing together",
    title: "Advancing excellence in",
    accent: "loss prevention.",
    body: "Supporting professionals through recognized membership, credible certification and continuous development built for today's evolving loss prevention landscape.",
    primary: { label: "Explore Membership", href: "#membership" },
    secondary: {
      label: "View Certifications",
      href: "#certification",
      icon: Bookmark02Icon,
    },
  },
  {
    image: Assets.images.heroBg2,
    alt: "CHLPS professionals standing together",
    title: "Join modern",
    accent: "loss prevention.",
    body: "Become part of a professional community committed to advancing knowledge, strengthening practice and supporting meaningful career growth.",
    primary: { label: "Become a Member", href: "#membership" },
    secondary: {
      label: "Explore Memberships",
      href: "#membership",
      icon: UserGroupIcon,
    },
  },
  {
    image: Assets.images.heroBg3,
    alt: "CHLPS professionals collaborating",
    title: "Build professional",
    accent: "credibility.",
    body: "Gain recognized credentials that demonstrate your competence, strengthen your professional standing and support your career progression.",
    primary: { label: "Explore Membership", href: "#membership" },
    secondary: {
      label: "See the Learning Pathway",
      href: "#careers",
      icon: Share07Icon,
    },
  },
];

const pathwayIcons = [
  { icon: ShieldCheckIcon, label: "Membership" },
  { icon: GraduationCapIcon, label: "Certification" },
  { icon: UserGroupIcon, label: "Professional development" },
] as const;

function PathwayCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border-[4px] border-white bg-[#CDA54E]/40 px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-md sm:gap-5 sm:px-6 sm:py-5 ${className}`}
    >
      <div className="flex shrink-0 items-center -space-x-2.5 sm:-space-x-3.5">
        {pathwayIcons.map(({ icon, label }) => (
          <span
            key={label}
            title={label}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white ring-2 ring-[#CDA54E]/80 sm:h-[50px] sm:w-[50px]"
          >
            <HugeiconsIcon
              icon={icon}
              size={20}
              color="#111E2A"
              strokeWidth={1.8}
            />
          </span>
        ))}
      </div>
      <div className="min-w-0 text-[#111E2A]">
        <p className="text-[20px] font-medium text-white leading-snug">
          Membership. Certification. Professional development.
        </p>
        <p className="mt-0.5 text-[15px] text-white leading-snug">
          One progressive career pathway.
        </p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setActive((index) => (index + 1) % heroSlides.length);
    }, SLIDE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#111E2A] ">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity ease-in-out ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          >
            <Image
              src={slide.image}
              alt={index === active ? slide.alt : ""}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[right_center]"
            />
          </div>
        ))}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/10"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="flex items-center py-10 sm:py-12 lg:min-h-[38rem] lg:py-16 xl:min-h-[42rem] xl:py-20">
          <div className="w-full max-w-[812px]">
            <Reveal delay={80}>
              <div className="grid">
                {heroSlides.map((slide, index) => {
                  const isActive = index === active;

                  return (
                    <div
                      key={slide.title}
                      className={`col-start-1 row-start-1 transition-opacity ease-in-out ${
                        isActive
                          ? "opacity-100"
                          : "pointer-events-none opacity-0"
                      }`}
                      style={{ transitionDuration: `${FADE_MS}ms` }}
                      aria-hidden={!isActive}
                    >
                      <h1 className="mt-5 text-[2rem] font-normal leading-[1.12] tracking-tight text-white sm:text-4xl lg:mt-6 lg:text-[2.75rem] xl:text-[3.35rem] xl:leading-[1.08]">
                        {slide.title}
                        <br />
                        <span className="text-secondary">{slide.accent}</span>
                      </h1>

                      <p className="mt-5 max-w-[36rem] text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-6 lg:max-w-[28rem] lg:text-lg xl:max-w-[34rem] xl:text-xl 2xl:max-w-[40rem] 2xl:text-[1.75rem] 2xl:leading-snug">
                        {slide.body}
                      </p>

                      <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link
                          href={slide.primary.href}
                          tabIndex={isActive ? undefined : -1}
                          className="rounded-full inline-flex h-12 items-center gap-2 bg-secondary px-6 text-[13px] font-semibold text-[#111E2A] transition-all duration-200 hover:brightness-95 sm:text-sm"
                          style={{ "--cut": "0.85rem" } as CSSProperties}
                        >
                          {slide.primary.label}
                          <HugeiconsIcon
                            icon={ArrowUpRight01Icon}
                            size={16}
                            color="currentColor"
                            strokeWidth={2}
                          />
                        </Link>
                        <Link
                          href={slide.secondary.href}
                          tabIndex={isActive ? undefined : -1}
                          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/85 px-6 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-white/10 sm:text-sm"
                        >
                          {slide.secondary.label}
                          <HugeiconsIcon
                            icon={slide.secondary.icon}
                            size={16}
                            color="currentColor"
                            strokeWidth={2}
                          />
                        </Link>
                      </div>
                    </div>
                  );
                })}
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
        <div className="pointer-events-auto max-w-[500px]">
          <PathwayCard />
        </div>
      </Reveal>
    </section>
  );
}
