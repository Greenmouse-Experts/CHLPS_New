import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";

export default function CertificationMattersSection() {
  return (
    <section
      id="why-certification-matters"
      className="relative overflow-hidden bg-white py-8 "
    >
      <PageContainer className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex min-w-0 flex-col h-full">
            <HeaderText notCenter left="why certification" right="matters" />
            {/*<Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Why Certification Matters:
              </span>
            </Reveal>*/}

            <Reveal delay={80}>
              <h2 className="text-[1.75rem] font-medium leading-tight tracking-tight text-primary">
                An Investment in Your Career
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className=" max-w-[36rem] text-[15px] leading-relaxed text-[#5B5A66] sm:text-base lg:mt-5 lg:text-[17px] xl:text-[18px]">
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
