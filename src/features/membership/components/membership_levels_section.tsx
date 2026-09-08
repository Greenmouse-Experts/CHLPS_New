import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const levels = [
  {
    key: "student",
    title: "Student Membership",
    body: "For individuals currently studying loss prevention, security, criminology, risk management or related disciplines.",
    badge: Assets.images.membership.student,
    href: "#membership-student",
  },
  {
    key: "affiliate",
    title: "Affiliate Membership",
    body: "An accessible entry point for individuals exploring the profession or transitioning from related operational fields.",
    badge: Assets.images.membership.affiliate,
    href: "#membership-affiliate",
  },
  {
    key: "licentiate",
    title: "Licentiate Membership",
    body: "For practitioners with foundational knowledge and practical exposure who are formalising their professional standing.",
    badge: Assets.images.membership.licentiate,
    href: "#membership-licentiate",
  },
  {
    key: "associate",
    title: "Associate Membership",
    body: "For professionals with practical experience seeking continued development, recognition and stronger career progression.",
    badge: Assets.images.membership.associate,
    href: "#membership-associate",
  },
  {
    key: "certified",
    title: "Certified Membership",
    body: "For qualified professionals with proven expertise who want their competence and professional standing formally recognised.",
    badge: Assets.images.membership.certified,
    href: "#membership-certified",
  },
  {
    key: "corporate",
    title: "Corporate Membership",
    body: "For organisations looking to develop their teams and strengthen professional loss prevention practice across the workplace.",
    badge: Assets.icons.logo,
    href: "#membership-corporate",
    cropLogo: true,
  },
] as const;

function MembershipBadge({
  src,
  alt,
  cropLogo = false,
}: {
  src: string;
  alt: string;
  cropLogo?: boolean;
}) {
  return (
    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-secondary bg-white">
      {cropLogo ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="64px"
          className="object-cover object-left"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={100}
          height={104}
          className="h-[2.7rem] w-auto object-contain"
        />
      )}
    </span>
  );
}

export default function MembershipLevelsSection() {
  return (
    <section
      id="membership-levels"
      className="relative overflow-hidden bg-[#F4F3F8] py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-0 z-0 h-[min(92%,920px)] w-[min(72%,780px)]"
      >
        <Image
          src={Assets.images.border}
          alt=""
          fill
          className="object-contain object-right-top"
          sizes="(max-width: 1024px) 70vw, 40vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Membership Levels
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
                Find your membership level.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={160} className="min-w-0 lg:max-w-[22rem] lg:shrink-0">
            <p className="text-[15px] leading-relaxed text-[#676672] sm:text-base">
              Six membership routes for professionals and organisations at every
              stage.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {levels.map((level, index) => (
            <article
              id={`membership-${level.key}`}
              key={level.key}
              className="group reveal relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[24px] border border-[#CDA54E] bg-white p-6 sm:p-8"
              style={revealStyle(index)}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0"
              >
                <Image
                  src={Assets.images.certificateCardBg}
                  alt=""
                  fill
                  className="object-cover object-bottom"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[#141549] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <Image
                  src={Assets.images.membershipCardBg}
                  alt=""
                  fill
                  className="object-cover object-bottom"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <MembershipBadge
                  src={level.badge}
                  alt={`${level.title} badge`}
                  cropLogo={"cropLogo" in level && level.cropLogo}
                />
                <h3 className="mt-6 text-lg font-bold leading-snug text-[#151515] transition-colors duration-300 group-hover:text-white group-focus-within:text-white sm:text-xl lg:text-[30px]">
                  {level.title}
                </h3>
                <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#676672] transition-colors duration-300 group-hover:text-white/90 group-focus-within:text-white/90 sm:text-[20px]">
                  {level.body}
                </p>
                <Link
                  href={level.href}
                  className="mt-auto flex min-w-0 items-center justify-between gap-3 pt-8"
                >
                  <span className="min-w-0 text-[13px] font-bold text-[#151515] transition-colors duration-300 group-hover:text-white group-focus-within:text-white sm:text-[18px]">
                    Explore {level.title}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-[#111E2A] sm:h-11 sm:w-11">
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={18}
                      color="currentColor"
                      strokeWidth={2.2}
                    />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
