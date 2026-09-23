"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import type { CertificationDetail } from "@/features/certification/certification_details";
import HeaderText from "@/components/HeaderText";

export default function CertificationDetailsOutcomeSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  const [imgSrc, setImgSrc] = useState(detail.outcomeImage);

  if (
    (!detail.outcomeBody || detail.outcomeBody.length === 0) &&
    !detail.outcomeTitle
  ) {
    return null;
  }

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <PageContainer>
        <Reveal>
          <article className="overflow-hidden rounded-[1.75rem] border border-[#D4B56A] bg-[#F6F5FB] lg:rounded-[2rem]">
            <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
              <div className="flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                <div className="relative w-full max-w-[36rem]">
                  <Image
                    src={imgSrc}
                    alt={`${detail.abbr} certificate`}
                    width={3456}
                    height={2316}
                    unoptimized
                    onError={() => setImgSrc(Assets.images.clpaCertificate)}
                    className="h-auto w-full rounded-[0.9rem] object-contain shadow-[0_16px_36px_rgba(10,21,66,0.18)] sm:rounded-[1.05rem]"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center bg-[#0A1542] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-12">
                <h2 className="uppercase text-secondary text-4xl font-semibold">
                  {detail.outcomeBadge.split(" ")[0]}{" "}
                  <span className="text-white">
                    {detail.outcomeBadge.split(" ")[1]} Certification
                  </span>
                </h2>

                {detail.outcomeBody && detail.outcomeBody.length > 0 && (
                  <div className="mt-5 max-w-[28rem] space-y-4 sm:mt-6">
                    {detail.outcomeBody.map((paragraph) => (
                      <p
                        key={paragraph}
                        className=" leading-[1.7] text-white/90 "
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        </Reveal>
      </PageContainer>
    </section>
  );
}
