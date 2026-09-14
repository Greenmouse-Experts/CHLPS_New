import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import type { CertificationDetail } from "@/features/certification/certification_details";

export default function CertificationDetailsBenefitsSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  return (
    <section className="relative overflow-hidden bg-[#FAF7EC] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0">
        <Image
          src={Assets.images.certificateDetailsBenefitsBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
      </div>

      <PageContainer className="relative z-10">
        <Reveal>
          <article className="rounded-[1.75rem] bg-white px-5 py-8 shadow-[0_18px_40px_rgba(34,26,122,0.06)] sm:rounded-[2rem] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <h2 className="text-[1.5rem] font-medium leading-tight tracking-tight text-[#221A7A] sm:text-[1.85rem] lg:text-[2.15rem]">
              {detail.benefitsTitle}
            </h2>

            <ul className="mt-6 flex flex-col gap-3 sm:mt-7 sm:gap-3.5">
              {detail.benefits.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-full bg-[#F3F0FB] px-3.5 py-3.5 sm:gap-4 sm:px-5 sm:py-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white sm:h-8 sm:w-8">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={15}
                      color="#6B65C4"
                      strokeWidth={2.4}
                    />
                  </span>
                  <span className="min-w-0 text-[13px] leading-relaxed text-[#2B2367] sm:text-[15px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </PageContainer>
    </section>
  );
}
