"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
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

// Level badges mapped by certification abbreviation
const LEVEL_BADGES: Record<string, string> = {
  BCLP: "FOUNDATIONAL LEVEL",
  CLPA: "ASSOCIATE LEVEL",
  CLPO: "INTERMEDIATE LEVEL",
  CLPM: "MANAGERIAL LEVEL",
  ACLPM: "ADVANCED LEVEL",
  ACIPM: "ADVANCED LEVEL",
  ChLPS: "EXECUTIVE LEVEL",
  CHLPS: "CHARTERED LEVEL",
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
      router.push(
        `/dashboard/sign-in?redirect=${encodeURIComponent(detailHref)}`,
      );
      return;
    }

    const appQuestions = (course as any).applicationQuestions ?? [];
    if (!appQuestions || appQuestions.length === 0) {
      setSelectedCheckout({
        title: programme.title,
        course,
      });
      return;
    }

    setCheckingEnrollCourseId(course.id);
    try {
      const appRes = await orderService.fetchMyCourseApplication(course.id);
      if (appRes.success && appRes.data?.id) {
        setSelectedCheckout({
          title: programme.title,
          course,
          applicationId: appRes.data.id,
        });
      } else {
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
            <span className="inline-block rounded-full bg-[#EEEAF8] px-4 py-1.5  font-bold uppercase tracking-[0.14em] text-primary sm:">
              Certification Pathways
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 max-w-[42rem] text-[1.85rem]  leading-tight tracking-tight text-[#161058] sm:mt-5 sm:text-[2.35rem] lg:text-[2.75rem]">
              From entry-level foundations to chartered executive distinction
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-4 max-w-[36rem]  leading-relaxed text-[#554F7A] sm:text-[15px]">
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
                const levelBadge = LEVEL_BADGES[abbr] || "PROFESSIONAL LEVEL";
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

                const rawClean = programme.title
                  .replace(/\s*\([^)]*\)/g, "")
                  .replace(/™/g, "")
                  .trim();
                const hasAbbrPrefix = rawClean.toUpperCase().startsWith(abbr);
                const displayTitle = hasAbbrPrefix
                  ? rawClean
                  : `${abbr} – ${rawClean}`;

                const rawPrice =
                  firstCourse?.price != null ? Number(firstCourse.price) : null;
                const hasPrice =
                  rawPrice != null && !isNaN(rawPrice) && rawPrice > 0;
                const mainPriceDisplay = hasPrice
                  ? `$${rawPrice.toLocaleString()}`
                  : "Contact CHLPS";
                const priceWithCents = hasPrice
                  ? `$${rawPrice.toFixed(2)}`
                  : "$0.00";
                const durationText = (firstCourse as any)?.duration || "1 Year";

                return (
                  <article
                    key={programme.id || index}
                    style={revealStyle(index * 90)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-[#DEB853] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Top White Section: Seal, Level Badge & Title */}
                    <div className="flex flex-1 flex-col justify-between bg-white p-6 sm:p-7">
                      {/* Top Row: Circular Gold Ring Seal + Level Badge */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[#DEB853] bg-white p-2 shadow-xs">
                          <Image
                            src={sealSrc}
                            alt={programme.title}
                            fill
                            className="object-contain p-1.5"
                            sizes="80px"
                          />
                        </div>
                        <span className="inline-flex items-center rounded-full bg-[#ECE8F6] px-3.5 py-1.5  font-bold uppercase tracking-wider text-[#5A4E9E]">
                          {levelBadge}
                        </span>
                      </div>

                      {/* Certification Title */}
                      <div className="mt-6 min-h-[56px]">
                        <h3 className="text-[19px] font-semibold leading-snug text-[#161058] sm:text-[21px]">
                          {displayTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Navy Section: Fee, Price, Copy & Action */}
                    <div className="bg-[#161058] p-6 sm:p-7">
                      <span className="block  font-bold uppercase tracking-[0.14em] text-white/70">
                        CERTIFICATION FEE
                      </span>

                      <div className="mt-1.5 text-[38px] font-bold leading-none text-white sm:text-[42px]">
                        {mainPriceDisplay}
                      </div>

                      {/* Gold Accent Divider */}
                      <div className="my-3.5 h-[2.5px] w-9 rounded-full bg-[#DEB853]" />

                      {/* Pricing / Expiry Terms */}
                      <div className="space-y-1  leading-relaxed text-white/80">
                        {hasPrice ? (
                          <>
                            <p>
                              {priceWithCents} now and then {priceWithCents}{" "}
                              after {durationText}.
                            </p>
                            <p className="text-white/60">
                              Membership expires after {durationText}.
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              Contact CHLPS for enrollment fee and schedule.
                            </p>
                            <p className="text-white/60">
                              Accredited qualification curriculum.
                            </p>
                          </>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-6">
                        <Link
                          href={enrollHref}
                          className="flex h-12 w-full items-center justify-center rounded-full bg-white  font-bold text-[#161058] shadow-sm transition duration-200 hover:bg-[#F3F2F8] active:scale-[0.99]"
                        >
                          Get started
                        </Link>
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
