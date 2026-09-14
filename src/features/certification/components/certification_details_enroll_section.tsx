import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import type { CertificationDetail } from "@/features/certification/certification_details";

export default function CertificationDetailsEnrollSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  return (
    <section className="bg-[#EDECF2] py-12 sm:py-14 lg:py-16">
      <PageContainer>
        <Reveal>
          <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(33,26,115,0.08)] lg:rounded-[2rem]">
            <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
              <div className="flex items-center bg-white px-6 py-9 sm:px-8 sm:py-11 lg:px-10 lg:py-12">
                <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
                  <span className="flex h-[5rem] w-[5rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#F3F0FC] sm:h-[5.5rem] sm:w-[5.5rem] sm:rounded-[1.4rem]">
                    <Image
                      src={detail.badge}
                      alt={`${detail.abbr} badge`}
                      width={320}
                      height={368}
                      className="h-[3.5rem] w-auto object-contain sm:h-[3.9rem]"
                    />
                  </span>
                  <h2 className="whitespace-pre-line text-[1.35rem] font-medium leading-[1.25] text-[#241B5E] sm:text-[1.65rem] lg:text-[1.85rem]">
                    {detail.cardTitle}
                  </h2>
                </div>
              </div>

              <div className="flex min-h-[13.75rem] flex-col justify-between bg-[#2F2683] px-6 py-8 sm:min-h-[15rem] sm:px-8 sm:py-9 lg:px-10 lg:py-9">
                <div>
                  <p className="text-[2.55rem] font-medium leading-none tracking-tight text-white sm:text-[2.85rem] lg:text-[3.15rem]">
                    {detail.fee}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/90 sm:text-[14px]">
                    {detail.feeNow}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-white/90 sm:text-[14px]">
                    {detail.feeExpiry}
                  </p>
                </div>

                <Link
                  href={detail.enrollHref}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-[14px] font-medium text-[#2F2683] transition-opacity duration-200 hover:opacity-90 sm:h-12"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </article>
        </Reveal>
      </PageContainer>
    </section>
  );
}
