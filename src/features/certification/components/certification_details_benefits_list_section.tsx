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
  if (!detail.benefits || detail.benefits.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#FAF7EC] p-10 ">
      <div className="absolute inset-0">
        <Image
          src={Assets.images.certificateDetailsBenefitsBg}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
      </div>

      <PageContainer className="relative z-10">
        <Reveal>
          <article className="rounded-[1.75rem] bg-white  shadow-[0_18px_40px_rgba(34,26,122,0.06)] sm:rounded-[2rem] p-6 max-w-7xl mx-auto">
            <h2 className="text-[1.5rem] font-medium leading-tight tracking-tight text-[#221A7A] sm:text-[1.85rem] lg:text-[2.15rem]">
              {detail.benefitsTitle}
            </h2>

            <ul className=" flex flex-col gap-3 mt-2 sm:gap-3.5">
              {detail.benefits.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] bg-[#F1EEFB] px-3.5 py-3.5 sm:gap-4 sm:px-5 sm:py-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#CFA84E66] bg-white sm:h-8 sm:w-8">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={15}
                      color="#6B65C4"
                      strokeWidth={2.4}
                    />
                  </span>
                  <span className="min-w-0  leading-relaxed text-[#2B2367] sm:text-[15px]">
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
