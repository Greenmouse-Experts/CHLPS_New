import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

export default function CertificationMattersSection() {
  return (
    <section
      id="why-certification-matters"
      className="relative overflow-hidden bg-white py-16 lg:py-20"
    >
      <PageContainer className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex min-w-0 flex-col">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Why Certification Matters:
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
                An Investment in Your Career
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 max-w-[36rem] text-[15px] leading-relaxed text-[#5B5A66] sm:text-base lg:mt-5 lg:text-[17px] xl:text-[18px]">
                Achieving any of our certifications is not just a milestone;
                it&apos;s an investment in your loss prevention and corporate
                security career. The rigorous training and assessments
                associated with each certification ensure that you are equipped
                with the knowledge, skills, and expertise needed to navigate the
                complex challenges of the industry.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="min-w-0">
            <div className="overflow-hidden rounded-br-[4.5rem] lg:rounded-br-[25px]">
              <Image
                src={Assets.images.certificationMatters}
                alt="Loss prevention professionals reviewing operations together on a tablet"
                width={3446}
                height={2252}
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
