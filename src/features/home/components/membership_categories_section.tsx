import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const categories = [
  {
    key: "student",
    title: "Student Membership",
    body: "For individuals currently studying loss prevention, security, criminology, risk management or related disciplines.",
    cta: "Explore student membership",
    badge: Assets.images.membership.student,
    href: "#membership-student",
  },
  {
    key: "affiliate",
    title: "Affiliate Membership",
    body: "An accessible entry point for individuals exploring the profession or transitioning from related operational fields.",
    cta: "Explore affiliate membership",
    badge: Assets.images.membership.affiliate,
    href: "#membership-affiliate",
  },
  {
    key: "licentiate",
    title: "Licentiate Membership",
    body: "For practitioners with foundational knowledge and practical exposure who are formalizing their professional standing.",
    cta: "Explore licentiate membership",
    badge: Assets.images.membership.licentiate,
    href: "#membership-licentiate",
  },
  {
    key: "associate",
    title: "Associate Membership",
    body: "For experienced professionals able to operate independently and contribute meaningfully to organizational loss reduction.",
    cta: "Explore associate membership",
    badge: Assets.images.membership.associate,
    href: "#membership-associate",
  },
  {
    key: "certified",
    title: "Certified Membership",
    body: "For professionals who have attained recognized certification and demonstrated strong operational and leadership capability.",
    cta: "Explore certified membership",
    badge: Assets.images.membership.certified,
    href: "#membership-certified",
  },
  {
    key: "corporate",
    title: "Corporate Membership",
    body: "For organizations advancing loss prevention, security and risk through professional standards.",
    cta: "Explore corporate membership",
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

export default function MembershipCategoriesSection() {
  return (
    <section id="membership" className="bg-[#F5F5F5] py-16 md:py-24">
      <PageContainer>
        <div className="flex items-center justify-center ">
          <div className="max-w-xl flex items-center justify-center flex-col">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3 py-1.5 sm:text-[20px] text-base font-bold uppercase tracking-[0.14em] text-white"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                MEMBERSHIP CATEGORIES
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 max-w-[400px] text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px] text-center">
              Find the level that fits your career stage.
              </h2>
            </Reveal>
          </div>
          
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {categories.map((category, index) => (
            <article
              id={`membership-${category.key}`}
              key={category.key}
              className="reveal relative flex h-full flex-col overflow-hidden rounded-2xl bg-[#141549] p-6 sm:p-8"
              style={revealStyle(index)}
            >
              <div aria-hidden className="pointer-events-none absolute inset-0">
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
                src={category.badge}
                alt={`${category.title} badge`}
                cropLogo={"cropLogo" in category && category.cropLogo}
              />
              <h3 className="mt-6 text-xl font-bold leading-snug text-white sm:text-[30px]">
                {category.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-white/90 sm:text-[20px]">
                {category.body}
              </p>
              <Link
                href={category.href}
                className="mt-auto inline-flex items-center gap-1.5 pt-8 text-[13px] font-bold text-secondary transition-opacity hover:opacity-80 sm:text-[20px]"
              >
                {category.cta}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={2}
                />
              </Link>
              </div>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
