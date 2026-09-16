"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import {
  fetchLivePrograms,
  type ApiProgramItem,
} from "@/features/certification/services/certification_menu_service";
import { resolveCertificationHref } from "@/features/certification/certification_details";
import { useAppSelector } from "@/lib/store/store";
import { StripePaymentModal } from "@/features/orders";
import type { Course } from "@/types";

// Static level badges mapped by title/level
const LEVEL_BADGES: Record<string, string> = {
  BCLP: "FOUNDATIONAL",
  CLPA: "ASSOCIATE",
  CLPO: "SUPERVISORY",
  CLPM: "MANAGERIAL",
  ACLPM: "ADVANCED",
  ACIPM: "ADVANCED",
  ChLPS: "EXECUTIVE",
  CHLPS: "CHARTERED",
};

const SEALS_BY_ABBR: Record<string, string> = {
  BCLP: Assets.images.certificates.bclp,
  CLPA: Assets.images.certificates.clpa,
  CLPO: Assets.images.certificates.clpo,
  CLPM: Assets.images.certificates.clpm,
  ACLPM: Assets.images.certificates.acipm,
  ACIPM: Assets.images.certificates.acipm,
  ChLPS: Assets.images.certificates.chlps,
  CHLPS: Assets.images.certificates.chlps,
};

function ProgrammeSeal({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="flex h-[3.85rem] w-[3.85rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.1rem] bg-[#F2EEFA] p-2 sm:h-[4.4rem] sm:w-[4.4rem] sm:rounded-[1.25rem]">
      <Image
        src={src}
        alt={alt}
        width={320}
        height={368}
        unoptimized
        className="h-full w-auto max-w-full object-contain"
      />
    </span>
  );
}

export default function CertificationPathwaySection() {
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);

  const [selectedCheckout, setSelectedCheckout] = useState<{
    title: string;
    course: Course;
  } | null>(null);

  const { data: livePrograms, isLoading } = useQuery({
    queryKey: ["live-certification-programs"],
    queryFn: fetchLivePrograms,
    staleTime: 5 * 60 * 1000,
  });

  const programs = livePrograms || [];

  const handleEnrollClick = (programme: ApiProgramItem, course?: Course) => {
    const detailHref = resolveCertificationHref({
      id: programme.id,
      slug: programme.slug,
    });

    if (!course) {
      router.push(detailHref);
      return;
    }

    if (!token) {
      // Guest: redirect to register/sign-in page with return redirect
      router.push(
        `/dashboard/sign-in?redirect=${encodeURIComponent(detailHref)}`,
      );
      return;
    }

    // Authenticated student: trigger Stripe Payment Modal with preview-before-create
    setSelectedCheckout({
      title: programme.title,
      course,
    });
  };

  return (
    <section id="pathways" className="bg-[#FAF9FD] py-16 sm:py-20 lg:py-24">
      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-block rounded-full bg-[#EEEAF8] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[12px]">
              Certification Pathways
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 max-w-[42rem] text-[1.85rem] font-light leading-tight tracking-tight text-[#161058] sm:mt-5 sm:text-[2.35rem] lg:text-[2.75rem]">
              From entry-level foundations to chartered executive distinction
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-4 max-w-[36rem] text-[13px] leading-relaxed text-[#554F7A] sm:text-[15px]">
              Each CHLPS certification aligns with a distinct career phase,
              equipping candidates with targeted competencies and verifiable
              professional standing.
            </p>
          </Reveal>
        </div>

        {isLoading && (
          <div className="mt-12 text-center text-[#554F7A]">
            <p>Loading certification pathways...</p>
          </div>
        )}

        {!isLoading && programs.length === 0 && (
          <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-dashed border-[#D2CEDF] bg-white p-8 text-center text-[#554F7A]">
            <p>No certification programs currently available.</p>
          </div>
        )}

        {programs.length > 0 && (
          <div className="mt-12 sm:mt-14 lg:mt-16">
            <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((programme, index) => {
                const title = programme.title || "";
                const match = title.match(/\(([A-Za-z™]+)\)/);
                const abbr = match ? match[1].replace(/™/g, "") : "CHLPS";
                const level = LEVEL_BADGES[abbr] || "PROFESSIONAL";
                const image =
                  programme.coverImage ||
                  SEALS_BY_ABBR[abbr] ||
                  Assets.images.certificates.clpa;
                const enrollHref = resolveCertificationHref({
                  id: programme.id,
                  slug: programme.slug,
                });

                const firstCourse = programme.courses?.[0];
                const price = firstCourse?.price;

                return (
                  <article
                    key={programme.id}
                    className="reveal flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[20px] rounded-tl-[35px] bg-secondary border border-[#CDA54EB8]"
                    style={revealStyle(index)}
                  >
                    <div className="mt-[5px] flex flex-1 flex-col overflow-hidden rounded-tl-[25px] rounded-tr-[10px] rounded-b-[20px] bg-white">
                      <div className="flex shrink-0 flex-col px-6 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
                        <div className="flex items-start justify-between gap-3">
                          <ProgrammeSeal
                            src={image}
                            alt={`${programme.title} seal`}
                          />
                          <span className="inline-flex shrink-0 rounded-full bg-[#EEEAF8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary sm:text-[11px]">
                            {level}
                          </span>
                        </div>

                        <h3 className="mt-4 min-h-[4.2rem] text-[1.15rem] font-medium leading-snug text-[#161058] sm:min-h-[5rem] sm:text-[1.35rem] lg:min-h-[6.75rem] lg:text-[27px]">
                          {programme.title}
                        </h3>
                      </div>

                      <div className="flex flex-1 flex-col bg-[#211A7A] px-6 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                          Certification Fee
                        </p>
                        <p className="mt-1 text-[1.75rem] font-bold leading-none text-white sm:text-[2rem]">
                          {price !== undefined && price !== null
                            ? `CAD $${Number(price).toLocaleString()}`
                            : "Contact for pricing"}
                        </p>
                        <span
                          aria-hidden
                          className="mt-2 block h-[2px] w-10 bg-secondary"
                        />
                        <p className="mt-2.5 min-h-[2.8rem] text-[13px] leading-relaxed text-white/90 sm:text-[14px]">
                          {firstCourse?.title ? (
                            <span className="line-clamp-2">
                              {firstCourse.title}
                            </span>
                          ) : (
                            "Comprehensive accredited qualification curriculum."
                          )}
                        </p>

                        <div className="mt-5 flex flex-col gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleEnrollClick(programme, firstCourse)
                            }
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-secondary text-[14px] font-bold text-[#161058] shadow-sm transition-all duration-200 hover:brightness-105 active:scale-[0.99]"
                          >
                            <span>Enroll Now</span>
                            <HugeiconsIcon
                              icon={ArrowUpRight01Icon}
                              size={16}
                              strokeWidth={2.2}
                            />
                          </button>
                          <Link
                            href={enrollHref}
                            className="inline-flex h-10 w-full items-center justify-center rounded-full border border-white/30 bg-white/10 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-white/20"
                          >
                            View Curriculum Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </RevealGroup>
          </div>
        )}

        {/* Stripe Payment Modal for Direct Enrollment */}
        {selectedCheckout && (
          <StripePaymentModal
            isOpen={Boolean(selectedCheckout)}
            onClose={() => setSelectedCheckout(null)}
            title={`Enroll in ${selectedCheckout.title}`}
            courses={[
              {
                id: selectedCheckout.course.id,
                price: Number(selectedCheckout.course.price) || 0,
              },
            ]}
            estimatedAmount={Number(selectedCheckout.course.price) || 0}
            onSuccess={() => {
              setSelectedCheckout(null);
              router.push("/dashboard/courses");
            }}
          />
        )}
      </PageContainer>
    </section>
  );
}
