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
  cta?: { label: string; href?: string; onClick?: () => void };
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

      <PageContainer className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-28">
        <div
          className={`grid items-center gap-10 lg:gap-14 ${
            hasExtra ? "lg:grid-cols-[1fr_auto]" : ""
          }`}
        >
          <div>
            {badge ? (
              <Reveal>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span className="text-[11px] font-semibold tracking-wider text-white uppercase sm:text-xs">
                    {badge}
                  </span>
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={80}>
              <h1
                className="text-[2rem] font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[40px] xl:text-[48px]"
                style={{ maxWidth: titleWidth ?? "800px" }}
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

            {children || cta ? (
              <div className={children ? "w-full max-w-[26.5rem]" : undefined}>
                {children ? (
                  <Reveal delay={220}>
                    <div className="mt-6 lg:mt-7">{children}</div>
                  </Reveal>
                ) : null}

                {cta ? (
                  <Reveal delay={children ? 300 : 240}>
                    {cta.onClick ? (
                      <button
                        type="button"
                        onClick={cta.onClick}
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
                      </button>
                    ) : (
                      <Link
                        href={cta.href || "#"}
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
                    )}
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
