"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import type { CertificationDetail } from "@/features/certification/certification_details";

export default function CertificationDetailsEnrollSection({
  detail,
  onEnroll,
}: {
  detail: CertificationDetail;
  onEnroll?: () => void;
}) {
  const [badgeSrc, setBadgeSrc] = useState(detail.badge);
  return (
    <section className="bg-[#EFEDF4] py-12 sm:py-14 lg:py-16">
      <PageContainer>
        <Reveal>
          <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(33,26,115,0.08)] lg:rounded-[2rem]">
            <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
              <div className="flex items-center bg-white px-6 py-9 sm:px-8 sm:py-11 lg:px-10 lg:py-12">
                <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
                  <span className="flex h-[5rem] w-[5rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#F3F0FC] sm:h-[5.5rem] sm:w-[5.5rem] sm:rounded-[1.4rem]">
                    <Image
                      src={badgeSrc}
                      alt={`${detail.abbr} badge`}
                      width={320}
                      height={368}
                      unoptimized
                      onError={() =>
                        setBadgeSrc(Assets.images.certificates.clpa)
                      }
                      className="h-[3.5rem] w-auto object-contain sm:h-[3.9rem]"
                    />
                  </span>
                  <h2 className="whitespace-pre-line text-[1.35rem] font-medium leading-[1.25] text-[#241B5E] sm:text-[1.65rem] lg:text-[1.85rem]">
                    {detail.cardTitle}
                  </h2>
                </div>
              </div>

              <div className="flex items-center bg-[#2F2683] p-4 sm:p-5 lg:p-6">
                <div className="flex w-full flex-col rounded-[1.35rem] border border-white/20 bg-white/[0.08] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl sm:rounded-[1.5rem] sm:px-6 sm:py-7">
                  {detail.fee && (
                    <p className="text-[2.55rem] font-bold leading-none tracking-tight text-white sm:text-[2.85rem] lg:text-[3.15rem]">
                      {detail.fee}
                    </p>
                  )}
                  {detail.feeNow && (
                    <p className="mt-4  leading-relaxed text-white/90 sm:text-[14px] lg:text-[15px]">
                      {detail.feeNow}
                    </p>
                  )}
                  {detail.feeExpiry && (
                    <p className="mt-3  leading-relaxed text-white/90 sm:text-[14px] lg:text-[15px]">
                      {detail.feeExpiry}
                    </p>
                  )}

                  {onEnroll ? (
                    <button
                      type="button"
                      onClick={onEnroll}
                      className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-[14px] font-bold text-[#2F2683] shadow-sm transition-all duration-200 hover:brightness-95 active:scale-[0.99] sm:mt-7 sm:h-12"
                    >
                      <span>Enroll Now</span>
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        size={16}
                        strokeWidth={2.2}
                      />
                    </button>
                  ) : (
                    <Link
                      href={detail.enrollHref}
                      className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-[14px] font-bold text-[#2F2683] transition-opacity duration-200 hover:opacity-90 sm:mt-7 sm:h-12"
                    >
                      <span>Enroll Now</span>
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        size={16}
                        strokeWidth={2.2}
                      />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </PageContainer>
    </section>
  );
}
