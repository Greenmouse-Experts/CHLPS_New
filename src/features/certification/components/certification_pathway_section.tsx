"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import {
  fetchLivePrograms,
  type ApiProgramItem,
} from "@/features/certification/services/certification_menu_service";
import { resolveCertificationHref } from "@/features/certification/certification_details";
import { useAppSelector } from "@/lib/store/store";
import { PaypalPaymentModal } from "@/features/orders";
import { orderService } from "@/features/orders/services/order_service";
import type { Course } from "@/types";
import HeaderText from "@/components/HeaderText";

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

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  CLPA: "The globally recognized IFPO certification — the gold standard for protection professionals.",
  BCLP: "Foundational qualification establishing core competencies in retail loss prevention and asset protection.",
  CLPO: "Intermediate operational qualification for protection officers and retail loss prevention specialists.",
  CLPM: "Managerial-level qualification for loss prevention supervisors, department heads, and security leaders.",
  ACLPM:
    "Advanced professional certificate in executive loss prevention leadership and organizational resilience.",
  ACIPM:
    "Advanced professional certificate in executive loss prevention leadership and organizational resilience.",
  ChLPS:
    "The flagship chartered loss prevention specialist designation for distinguished industry authorities.",
};

const DEFAULT_PRICES: Record<string, string> = {
  BCLP: "CA$495",
  CLPA: "CA$595",
  CLPO: "CA$695",
  CLPM: "CA$795",
  ACLPM: "CA$895",
  ACIPM: "CA$895",
  ChLPS: "CA$995",
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
    <section id="pathways" className="bg-[#FAF9FD] py-8  ">
      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <HeaderText left="certification" right="levels" />
        </div>

        {isLoading && (
          <div className="mt-8 text-center text-[#554F7A]">
            <span className="loading loading-dots loading-lg text-primary" />
            <p className="mt-3 text-sm text-[#554F7A]">
              Loading certification pathways...
            </p>
          </div>
        )}

        {!isLoading && programs.length === 0 && (
          <div className="card mx-auto mt-8 max-w-lg border border-dashed border-[#D2CEDF] bg-white p-8 text-center text-[#554F7A]">
            <p className="text-base font-medium">
              No certification programs currently available.
            </p>
          </div>
        )}

        {!isLoading && programs.length > 0 && (
          <div className="mt-8 sm:mt-4">
            <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((programme, index) => {
                const abbr = extractAbbr(programme.title);
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
                const displayTitle = rawClean;

                const rawPrice =
                  firstCourse?.price != null ? Number(firstCourse.price) : null;
                const hasPrice =
                  rawPrice != null && !isNaN(rawPrice) && rawPrice > 0;
                const priceDisplay = hasPrice
                  ? `CA$${rawPrice.toLocaleString()}`
                  : DEFAULT_PRICES[abbr] || "CA$595";

                const description =
                  DEFAULT_DESCRIPTIONS[abbr] ||
                  firstCourse?.shortDesc ||
                  programme.description ||
                  "The globally recognized IFPO certification — the gold standard for protection professionals.";

                const isEnrolling = checkingEnrollCourseId === firstCourse?.id;
                const abbr_cta = programme.title.split(" ")[0];
                return (
                  <article
                    key={programme.id || index}
                    style={revealStyle(index * 90)}
                    className="card group relative flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-[#C99E4A] bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {/* Top White Section: Circular Gold Ring Seal & Title */}
                    <div className="flex flex-1 flex-col items-center justify-between bg-white text-center py-3">
                      <Link
                        href={enrollHref}
                        className="group/link flex flex-col items-center space-y-3"
                        aria-label={`View details for ${displayTitle}`}
                      >
                        {/* Circular Gold Ring Seal */}
                        <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-[#C99E4A] bg-white p-3 shadow-xs transition-transform duration-300 group-hover/link:scale-105 sm:h-32 sm:w-32">
                          <Image
                            src={sealSrc}
                            alt={programme.title}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 640px) 112px, 128px"
                          />
                        </div>

                        {/* Certification Title */}
                        <h3 className=" text-lg font-bold leading-snug tracking-tight text-[#161058] transition-colors duration-200 group-hover/link:text-[#0A1542] max-w-4/5  ">
                          {displayTitle}
                        </h3>
                      </Link>
                    </div>

                    {/* Bottom Dark Navy Section: Description, Price & Gold Enroll Button */}
                    <div className="relative flex flex-col items-center overflow-hidden bg-[#0B0E33] p-3 text-center ">
                      {/* Subtle ambient gradient wave */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(35,46,120,0.35),transparent_65%)]"
                      />

                      <div className="relative z-10 flex w-full flex-col items-center">
                        {/* Description */}
                        <p className="min-h-[44px] max-w-[300px] text-center text-sm leading-relaxed text-white/90 sm:text-base line-clamp-3">
                          {description}
                        </p>

                        {/* Price */}
                        <div className="my-2 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
                          {priceDisplay}
                        </div>

                        {/* Gold Action Button (DaisyUI btn) */}
                        <Link
                          href={enrollHref}
                          type="button"
                          // onClick={() =>
                          //   handleEnrollClick(programme, firstCourse)
                          // }
                          // disabled={isEnrolling}
                          className="btn btn-secondary btn-block"
                        >
                          {isEnrolling ? (
                            <div className="flex items-center gap-2">
                              <span className="loading loading-spinner loading-sm" />
                              <span>Checking...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span>Enroll</span>
                              <HugeiconsIcon
                                icon={ArrowUpRight01Icon}
                                size={18}
                                color="#0B0E33"
                                strokeWidth={2.5}
                              />
                            </div>
                          )}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </RevealGroup>
          </div>
        )}

        {/* PayPal Payment Modal for Direct Enrollment */}
        {selectedCheckout && (
          <PaypalPaymentModal
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
