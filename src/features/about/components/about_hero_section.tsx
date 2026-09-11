"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type AboutHeroSectionProps = {
  badge?: string;
  title: string;
  accent?: string;
  body?: string;
  titleWidth?: string;
  bodyWidth?: string;
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
  cta?: { label: string; href: string };
  children?: ReactNode;
};

export default function AboutHeroSection({
  badge,
  title,
  accent,
  body,
  titleWidth,
  bodyWidth,
  image = Assets.images.heroBg2,
  imageAlt = "CHLPS Canada professionals standing together in an office",
  imageClassName = "object-cover object-[right_15%]",
  cta,
  children,
}: AboutHeroSectionProps) {
  const [imageSrc, setImageSrc] = useState(image);

  useEffect(() => {
    setImageSrc(image);
  }, [image]);

  const hasExtra = Boolean(cta || children);

  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#030E20]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          key={imageSrc}
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          unoptimized
          onError={() => setImageSrc(Assets.images.heroBg2)}
          className={imageClassName}
        />
      </div>

      <PageContainer className="relative h-full">
        <div
          className={`flex h-full items-center py-10 sm:py-12 ${
            children
              ? "lg:min-h-[42rem] lg:py-16 xl:min-h-[48rem] xl:py-20"
              : hasExtra
                ? "lg:min-h-[32rem] lg:py-16 xl:min-h-[36rem] xl:py-20"
                : "lg:min-h-[547px] lg:py-8"
          }`}
        >
          <div className="w-full">
            {/*{badge ? (
              <Reveal>
                <span
                  className="cut-bl-tr inline-block bg-secondary px-4 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-[#211A73] sm:text-[12px]"
                  style={{ "--cut": "0.55rem" } as CSSProperties}
                >
                  {badge}
                </span>
              </Reveal>
            ) : null}*/}

            <Reveal delay={80}>
              <h1
                className={`${badge ? "mt-5 lg:mt-6" : ""} text-[2rem] font-light leading-[1.12] tracking-tight text-white sm:text-[48px] xl:leading-[1.08]`}
                style={titleWidth ? { maxWidth: titleWidth } : undefined}
              >
                {title}
                {accent ? (
                  <>
                    <br />
                    <span className="text-secondary">{accent}</span>
                  </>
                ) : null}
              </h1>
            </Reveal>

            {/*{body ? (
              <Reveal delay={160}>
                <p
                  className="mt-4 text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5 lg:text-base xl:text-[20px]"
                  style={{ maxWidth: bodyWidth ?? "740px" }}
                >
                  {body}
                </p>
              </Reveal>
            ) : null}*/}

            {children || cta ? (
              <div className={children ? "w-full max-w-[26.5rem]" : undefined}>
                {children ? (
                  <Reveal delay={220}>
                    <div className="mt-6 lg:mt-7">{children}</div>
                  </Reveal>
                ) : null}

                {cta ? (
                  <Reveal delay={children ? 300 : 240}>
                    <Link
                      href={cta.href}
                      className={`mt-6 items-center gap-2 rounded-full bg-secondary px-5 text-[13px] font-semibold text-[#111E2A] transition-all duration-200 hover:brightness-95 sm:h-12 sm:px-6 sm:text-sm lg:mt-7 ${
                        children
                          ? "flex h-11 w-full justify-center"
                          : "inline-flex h-11"
                      }`}
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
            ) : null}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
