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
import HeaderSubText from "@/components/HeaderSubText";
import HeaderText from "@/components/HeaderText";

type AboutHeroSectionProps = {
  badge?: string;
  title: string;
  accent?: string;
  body?: string;
  fixedHeight?: boolean;
  titleWidth?: string;
  bodyWidth?: string;
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
  cta?: { label: string; href?: string; onClick?: () => void };
  children?: ReactNode;
  showDefault?: boolean;
  padding?: boolean;
};

export default function AboutHeroSection({
  badge,
  title,
  accent,
  body,
  fixedHeight = false,
  titleWidth,
  bodyWidth,
  image = Assets.images.heroBg2,
  imageAlt = "CHLPS Canada professionals standing together in an office",
  imageClassName = "object-cover object-[right_15%]",
  cta,
  children,
  showDefault = false,
  padding = false,
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

      <PageContainer
        className={`relative z-10 ${padding ? "py-20" : "py-8"} ${fixedHeight ? "min-h-[380px]" : ""}`}
      >
        <div
          className={`grid items-center gap-10 lg:gap-14 ${
            hasExtra ? "lg:grid-cols-[1fr_auto]" : ""
          }`}
        >
          <div>
            {badge ? <></> : null}
            {showDefault && (
              <div className="max-w-xl">
                <HeaderText
                  textWhite
                  notCenter
                  left="A professional home for every stage"
                  right="of loss prevention."
                />
                <p className="text-white text-xl mt-4">
                  Build professional standing through membership,
                  <br /> certification and continous learning
                </p>
              </div>
            )}
            {/*<Reveal delay={80}>
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
            </Reveal>*/}
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
                        className={`mt-6 items-center gap-2 rounded-full bg-secondary px-5  font-semibold text-[#111E2A] transition-all duration-200 hover:brightness-95 sm:h-12 sm:px-6 sm: lg:mt-7 ${
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
                        className={`mt-6 items-center gap-2 rounded-full bg-secondary px-5  font-semibold text-[#111E2A] transition-all duration-200 hover:brightness-95 sm:h-12 sm:px-6 sm: lg:mt-7 ${
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
