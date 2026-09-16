"use client";

import { useState, useMemo } from "react";
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
import { orderService } from "@/features/orders/services/order_service";
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

function extractAbbr(title: string): string {
  const match = title.match(/\(([A-Za-z™]+)\)/);
  if (match && match[1]) {
    return match[1].replace(/™/g, "").trim();
  }
  const clean = title.toUpperCase();
  if (clean.includes("BCLP")) return "BCLP";
  if (clean.includes("CLPA")) return "CLPA";
  if (clean.includes("CLPO")) return "CLPO";
  if (clean.includes("CLPM")) return "CLPM";
  if (clean.includes("ACLPM") || clean.includes("ACIPM")) return "ACLPM";
  if (clean.includes("CHLPS")) return "ChLPS";
  return "CHLPS";
}

export default function CertificationPathwaySection() {
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);
  const [checkingEnrollCourseId, setCheckingEnrollCourseId] = useState<
    string | null
  >(null);
  const [selectedCheckout, setSelectedCheckout] = useState<{
    title: string;
    course: Course;
    applicationId?: string;
  } | null>(null);

  const { data: livePrograms, isLoading } = useQuery({
    queryKey: ["public-programs-pathway"],
    queryFn: fetchLivePrograms,
    staleTime: 60 * 1000,
  });

  const programs = livePrograms || [];

  const handleEnrollClick = async (
    programme: ApiProgramItem,
    course?: Course,
  ) => {
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

    const appQuestions = (course as any).applicationQuestions ?? [];
    // If course has no questionnaire/assessment questions, open payment modal directly
    if (!appQuestions || appQuestions.length === 0) {
      setSelectedCheckout({
        title: programme.title,
        course,
      });
      return;
    }

    // Course has assessment questions -> check attempts
    setCheckingEnrollCourseId(course.id);
    try {
      const appRes = await orderService.fetchMyCourseApplication(course.id);
      if (appRes.success && appRes.data?.id) {
        // Completed attempt exists -> load payment modal with applicationId
        setSelectedCheckout({
          title: programme.title,
          course,
          applicationId: appRes.data.id,
        });
      } else {
        // No attempts or not completed -> go to assessment page
        router.push(
          `/certification/${programme.slug || programme.id}/assessment`,
        );
      }
    } catch {
      router.push(
        `/certification/${programme.slug || programme.id}/assessment`,
      );
    } finally {
      setCheckingEnrollCourseId(null);
    }
  };

  const coursesForModal = useMemo(
    () =>
      selectedCheckout
        ? [
            {
              id: selectedCheckout.course.id,
              price: Number(selectedCheckout.course.price) || 0,
              applicationId: selectedCheckout.applicationId,
            },
          ]
        : [],
    [selectedCheckout],
  );

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

        {!isLoading && programs.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((programme, index) => {
                const abbr = extractAbbr(programme.title);
                const levelBadge = LEVEL_BADGES[abbr] || "PROFESSIONAL";
                const sealSrc =
                  programme.coverImage &&
                  programme.coverImage.startsWith("http")
                    ? programme.coverImage
                    : SEALS_BY_ABBR[abbr] || Assets.images.certificates.clpa;
                const enrollHref = resolveCertificationHref({
                  id: programme.id,
                  slug: programme.slug,
                });
                const firstCourse = programme.courses?.[0];
                const priceFormatted = firstCourse?.price
                  ? `CAD $${Number(firstCourse.price).toLocaleString()}`
                  : null;

                const isCheckingThisCourse =
                  checkingEnrollCourseId === firstCourse?.id;

                return (
                  <article
                    key={programme.id || index}
                    style={revealStyle(index * 90)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#161058] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7"
                  >
                    {/* Top Row: Seal + Level Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 p-2 shadow-inner">
                        <Image
                          src={sealSrc}
                          alt={programme.title}
                          fill
                          className="object-contain"
                          sizes="56px"
                        />
                      </div>
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white backdrop-blur-xs">
                        {levelBadge}
                      </span>
                    </div>

                    {/* Middle: Title, Code, Body */}
                    <div className="mt-6 flex flex-1 flex-col">
                      <span className="text-[12px] font-bold tracking-wider text-secondary">
                        {abbr}
                      </span>
                      <h3 className="mt-1 text-[17px] font-semibold leading-snug text-white sm:text-[19px]">
                        {programme.title.replace(/\s*\([^)]*\)/g, "").trim()}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/70">
                        {programme.description ||
                          "Accredited professional certification curriculum designed to enhance leadership, security principles, and industry competency."}
                      </p>
                    </div>

                    {/* Bottom: Price, Fee Detail & Actions */}
                    <div className="mt-8 border-t border-white/15 pt-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[12px] font-medium text-white/60">
                            Enrollment Fee
                          </span>
                          <span className="text-[18px] font-bold text-white">
                            {priceFormatted || "Contact for Pricing"}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/45">
                          {priceFormatted ? (
                            <span>
                              One-time enrollment fee &bull; Direct curriculum
                              access
                            </span>
                          ) : (
                            "Comprehensive accredited qualification curriculum."
                          )}
                        </p>

                        <div className="mt-5 flex flex-col gap-2.5">
                          <button
                            type="button"
                            disabled={isCheckingThisCourse}
                            onClick={() =>
                              handleEnrollClick(programme, firstCourse)
                            }
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-secondary text-[14px] font-bold text-[#161058] shadow-sm transition-all duration-200 hover:brightness-105 active:scale-[0.99] disabled:opacity-75"
                          >
                            {isCheckingThisCourse ? (
                              <>
                                <span className="loading loading-spinner loading-xs" />
                                <span>Checking...</span>
                              </>
                            ) : (
                              <>
                                <span>Enroll Now</span>
                                <HugeiconsIcon
                                  icon={ArrowUpRight01Icon}
                                  size={16}
                                  strokeWidth={2.2}
                                />
                              </>
                            )}
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
            courses={coursesForModal}
            estimatedAmount={Number(selectedCheckout.course.price) || undefined}
            onSuccess={() => {
              setSelectedCheckout(null);
              router.push("/dashboard/courses?payment=success");
            }}
          />
        )}
      </PageContainer>
    </section>
  );
}
