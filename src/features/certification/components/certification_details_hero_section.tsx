import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import type { CertificationDetail } from "@/features/certification/certification_details";

export default function CertificationDetailsHeroSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#0A1140]">
      <div className="absolute inset-0">
        <Image
          src={Assets.images.certificateDetailsHero}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <PageContainer className="relative min-w-0">
        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-8 py-12 sm:gap-10 sm:py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:py-16 xl:gap-10 xl:py-[4.5rem]">
          <div className="min-w-0 max-w-full pt-1 lg:max-w-[32.5rem] lg:pt-3 xl:pt-5">
            <Reveal>
              <h1 className="whitespace-pre-line text-[2.05rem] font-light leading-[1.12] tracking-tight text-white sm:text-[2.5rem] lg:text-[2.65rem] xl:text-[48px] xl:leading-[1.12]">
                {detail.heroTitle}
              </h1>
            </Reveal>

            <Reveal delay={90}>
              <p className="mt-6 text-[14px] leading-[1.75] text-white/95 sm:mt-7 sm:text-[15px] sm:leading-[1.7]">
                {detail.heroBody}
              </p>
            </Reveal>

            <Reveal delay={160}>
              <Link
                href={detail.enrollHref}
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-5 text-[13px] font-semibold text-[#0A1542] transition-all duration-200 hover:brightness-95 sm:mt-8 sm:h-12 sm:px-6 sm:text-[14px]"
              >
                Enroll Now
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={2}
                />
              </Link>
            </Reveal>
          </div>

          <Reveal
            delay={80}
            className="flex w-full min-w-0 justify-center lg:justify-end"
          >
            <div className="relative w-full min-w-0 max-w-[34rem] lg:max-w-[44rem] xl:max-w-[48rem] xl:-mr-6">
              <img
                src={
                  detail.outcomeImage ?? Assets.images.certificateDetailsMonitor
                }
                alt={`${detail.abbr} certification displayed on a desktop computer`}
                className="mx-auto"
                // width={2868}
                // height={2372}
                // priority
              />
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
