import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type AboutHeroSectionProps = {
  badge: string;
  title: string;
  accent: string;
  body: string;
  bodyWidth?: string;
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
  cta?: { label: string; href: string };
};

export default function AboutHeroSection({
  badge,
  title,
  accent,
  body,
  image = Assets.images.heroBg2,
  imageAlt = "CHLPS Canada professionals standing together in an office",
  imageClassName = "object-cover object-[right_15%]",
  cta,
}: AboutHeroSectionProps) {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#030E20]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className={imageClassName}
        />
      </div>

      <PageContainer className="relative h-full">
        <div
          className={`flex h-full items-center py-10 sm:py-12 ${
            cta ? "lg:min-h-[32rem] lg:py-16 xl:min-h-[36rem] xl:py-20" : "lg:py-8"
          }`}
        >
          <div className="w-full max-w-[640px] xl:max-w-[720px]">
            <Reveal>
              <span
                className="cut-bl inline-block bg-secondary px-4 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-[#211A73] sm:text-[20px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                {badge}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[40px] font-normal leading-[1.1] tracking-tight text-white sm:text-[50px] lg:mt-6 lg:text-[70px] xl:text-[80px] xl:leading-[1.08]">
                {title}
                <br />
                <span className="text-secondary">{accent}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p
                className={`mt-4 text-[15px] font-semibold leading-tight text-white/95 sm:text-[20px] lg:mt-5 lg:text-[30px] max-w-[720px]`}
              >
                {body}
              </p>
            </Reveal>

            {cta ? (
              <Reveal delay={240}>
                <Link
                  href={cta.href}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-5 text-[13px] font-semibold text-[#111E2A] transition-all duration-200 hover:brightness-95 sm:h-12 sm:px-6 sm:text-sm lg:mt-7"
                >
                  {cta.label}
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={2}
                  />
                </Link>
              </Reveal>
            ) : null}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
