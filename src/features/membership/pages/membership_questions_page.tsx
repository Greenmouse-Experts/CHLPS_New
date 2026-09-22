"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  HelpCircleIcon,
  SecurityCheckIcon,
  LockKeyIcon,
} from "@hugeicons/core-free-icons";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import { Button } from "@/components/ui";
import { fetchPublicMembershipBySlugOrId } from "@/features/membership/services/membership_service";
import { transformMembershipApiToType } from "@/features/membership/membership_types";
import { orderService } from "@/features/orders/services/order_service";
import { useAppSelector } from "@/lib/store/store";
import { StripePaymentModal } from "@/features/orders";
import QueryCompLayout from "@/components/QueryCompLayout";

interface MembershipQuestionsPageProps {
  id: string;
}

/** Deterministic 32-bit FNV-1a hash, used to derive stable question ids. */
function fnv1aHash(input: string, seed: number): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Builds a UUID for an application question returned without an id.
 * Backend validator requires UUID format for questionId.
 */
function deriveQuestionId(
  membershipId: string | undefined,
  index: number,
  question: string,
): string {
  const seed = `${membershipId ?? ""}::${index}::${question}`;
  const chars = [
    fnv1aHash(seed, 0x811c9dc5),
    fnv1aHash(seed, 0x9e3779b9),
    fnv1aHash(seed, 0x85ebca6b),
    fnv1aHash(seed, 0xc2b2ae35),
  ]
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("")
    .split("");

  // Force the version 4 / variant bits the API's UUID validator expects.
  chars[12] = "4";
  chars[16] = "89ab"[parseInt(chars[16], 16) & 0x3];

  const uuid = chars.join("");
  return [
    uuid.slice(0, 8),
    uuid.slice(8, 12),
    uuid.slice(12, 16),
    uuid.slice(16, 20),
    uuid.slice(20),
  ].join("-");
}

export default function MembershipQuestionsPage({
  id,
}: MembershipQuestionsPageProps) {
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);

  // Modal & submission state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // 1. Fetch Membership Details
  const membershipQuery = useQuery({
    queryKey: ["membership-detail-screening", id],
    queryFn: async () => {
      const apiItem = await fetchPublicMembershipBySlugOrId(id);
      if (!apiItem) return null;
      return {
        raw: apiItem,
        detail: transformMembershipApiToType(apiItem),
      };
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id),
  });

  const detail = membershipQuery.data?.detail;
  const membershipId = membershipQuery.data?.raw?.id || detail?.membershipId;
  const resolvedSlug = detail?.slug || membershipQuery.data?.raw?.slug || id;

  // 2. Redirect unauthenticated users
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!token) {
      const currentPath = window.location.pathname;
      router.push(
        `/dashboard/sign-in?redirect=${encodeURIComponent(currentPath)}`,
      );
    }
  }, [token, router]);

  // 3. Fetch existing application attempts for this membership
  const applicationQuery = useQuery({
    queryKey: ["my-membership-app", membershipId],
    queryFn: async () => {
      if (!membershipId) return null;
      const res = await orderService.fetchMyMembershipApplication(membershipId);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    },
    enabled: Boolean(membershipId && token),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const existingApp = applicationQuery.data;

  // Sync existing application ID if completed
  useEffect(() => {
    if (existingApp?.id) {
      setApplicationId(existingApp.id);
    }
  }, [existingApp]);

  // Questions from membership definition
  const rawQuestions = useMemo(
    () => detail?.applicationQuestions ?? [],
    [detail?.applicationQuestions],
  );

  // Normalize questions so every entry exposes an `id` that matches the UUID format
  const questions = useMemo(
    () =>
      rawQuestions.map((q, index) => {
        const text = typeof q === "string" ? q : q.question;
        const qId =
          typeof q === "string"
            ? deriveQuestionId(membershipId, index, text)
            : q.id || deriveQuestionId(membershipId, index, text);
        return {
          id: qId,
          question: text,
        };
      }),
    [rawQuestions, membershipId],
  );

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => typeof answers[q.id] === "boolean");

  const isAlreadyCompleted = Boolean(existingApp?.id || applicationId);

  const handleSelectAnswer = (questionId: string, answer: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitAssessment = async () => {
    if (!membershipId) {
      toast.error("Membership details missing. Please refresh.");
      return;
    }

    if (!allAnswered) {
      toast.error("Please answer all eligibility questions before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? false,
      }));

      const res = await orderService.submitMembershipApplication({
        membershipId,
        answers: payloadAnswers,
      });

      if (res.success) {
        toast.success("Application submitted successfully!");
        // Re-fetch application to ensure we have the verified ID
        const appRes =
          await orderService.fetchMyMembershipApplication(membershipId);
        const resolvedAppId = appRes.data?.id || (res.data as any)?.id;
        if (resolvedAppId) {
          setApplicationId(resolvedAppId);
        }
        // Immediately load the Stripe payment modal
        setIsPaymentModalOpen(true);
      } else {
        toast.error(
          res.message || "Failed to submit application. Please try again.",
        );
      }
    } catch (err: any) {
      toast.error(
        err?.message || "An error occurred while submitting your application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const membershipsForModal = useMemo(
    () =>
      membershipId
        ? [
            {
              id: membershipId,
              price: detail?.price ?? 0,
              applicationId: applicationId ?? undefined,
            },
          ]
        : [],
    [membershipId, detail?.price, applicationId],
  );

  return (
    <div className="min-h-screen bg-[#F5F4F8]">
      <Header />

      <main className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href={`/membership/${resolvedSlug}`}
              className="inline-flex items-center gap-2  font-semibold uppercase tracking-wider text-[#554F7A] transition hover:text-primary"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              <span>Back to Membership Details</span>
            </Link>
          </div>

          <QueryCompLayout
            query={membershipQuery}
            loadingText="Loading membership eligibility questionnaire..."
            emptyState={
              <div className="rounded-2xl border border-dashed border-[#D2CEDF] bg-white p-12 text-center shadow-xs">
                <h2 className="text-xl font-bold text-[#161058]">
                  Membership Not Found
                </h2>
                <p className="mt-2  text-[#554F7A]">
                  The membership program you requested could not be loaded.
                </p>
                <Link
                  href="/membership"
                  className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5  font-semibold text-white"
                >
                  View All Memberships
                </Link>
              </div>
            }
          >
            {detail && (
              <div className="space-y-8">
                {/* Header Card */}
                <div className="overflow-hidden rounded-3xl border border-[#E3DEED] bg-white p-6 shadow-xs sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      {detail.badge && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#E3DEED] bg-[#F7F6FA] p-2">
                          <Image
                            src={detail.badge}
                            alt={detail.title}
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-lilac/60 px-3 py-1  font-bold uppercase tracking-wider text-primary">
                          <HugeiconsIcon icon={SecurityCheckIcon} size={14} />
                          <span>Pre-Membership Screening</span>
                        </div>
                        <h1 className="mt-2 text-xl font-bold text-[#161058] sm:text-2xl">
                          {detail.gradeTitle || detail.title}
                        </h1>
                        <p className="mt-1  text-[#554F7A] sm:">
                          Please complete this screening questionnaire to
                          confirm your eligibility prior to checkout.
                        </p>
                      </div>
                    </div>

                    {typeof detail.price === "number" && (
                      <div className="shrink-0 rounded-2xl bg-[#F8F7FC] p-4 text-left sm:text-right">
                        <span className="block  font-bold uppercase tracking-wider text-[#554F7A]">
                          Membership Fee
                        </span>
                        <span className="text-lg font-bold text-[#161058] sm:text-xl">
                          {detail.currency || "CAD"} $
                          {detail.price.toLocaleString()}
                          {detail.duration ? ` / ${detail.duration}` : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* State A: Assessment Already Completed */}
                {isAlreadyCompleted ? (
                  <div className="overflow-hidden rounded-3xl border border-[#C5E8D3] bg-[#F3FAF5] p-6 shadow-xs sm:p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#189D52] text-white shadow-sm">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={36} />
                      </div>
                      <h2 className="mt-4 text-xl font-bold text-[#0E582E] sm:text-2xl">
                        Application Screening Completed
                      </h2>
                      <p className="mt-2 max-w-lg  text-[#276B45]">
                        You have already submitted your screening responses for
                        this membership grade. You are eligible to proceed
                        directly to payment and activate your membership.
                      </p>

                      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Button
                          onClick={() => setIsPaymentModalOpen(true)}
                          className="h-12 rounded-full bg-[#189D52] px-8  font-bold text-white shadow-sm hover:bg-[#158745]"
                        >
                          <HugeiconsIcon icon={LockKeyIcon} size={16} />
                          <span>Proceed to Payment</span>
                        </Button>
                        <Link
                          href={`/membership/${resolvedSlug}`}
                          className="inline-flex h-12 items-center justify-center rounded-full border border-[#B0DFC2] bg-white px-6  font-semibold text-[#0E582E] transition hover:bg-[#EAF6EF]"
                        >
                          Review Membership Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : questions.length === 0 ? (
                  /* State B: No Questions Defined */
                  <div className="overflow-hidden rounded-3xl border border-[#E3DEED] bg-white p-6 text-center shadow-xs sm:p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lilac/50 text-primary">
                      <HugeiconsIcon icon={HelpCircleIcon} size={30} />
                    </div>
                    <h2 className="mt-3 text-lg font-bold text-[#161058]">
                      No Prerequisites Required
                    </h2>
                    <p className="mx-auto mt-1.5 max-w-md  text-[#554F7A] sm:">
                      This membership grade does not require pre-screening
                      questions. You may proceed directly to checkout.
                    </p>
                    <Button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="mt-6 h-12 rounded-full bg-secondary px-8  font-bold text-[#111E2A] hover:brightness-95"
                    >
                      <span>Proceed to Payment</span>
                    </Button>
                  </div>
                ) : (
                  /* State C: Interactive Assessment Questionnaire */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                      <h2 className=" font-bold uppercase tracking-wider text-[#554F7A]">
                        Eligibility Questions ({questions.length})
                      </h2>
                      <span className=" font-semibold text-primary">
                        {Object.keys(answers).length} of {questions.length}{" "}
                        answered
                      </span>
                    </div>

                    <div className="space-y-4">
                      {questions.map((q, idx) => {
                        const currentAnswer = answers[q.id];
                        const isAnswered = typeof currentAnswer === "boolean";

                        return (
                          <div
                            key={q.id}
                            className={`overflow-hidden rounded-2xl border bg-white p-5 transition-all sm:p-6 ${
                              isAnswered
                                ? "border-primary/40 shadow-xs"
                                : "border-[#E3DEED]"
                            }`}
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex items-start gap-3.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lilac/70  font-bold text-primary">
                                  {idx + 1}
                                </span>
                                <p className=" font-semibold leading-relaxed text-[#161058] sm:text-base">
                                  {q.question}
                                </p>
                              </div>

                              {/* Yes / No Toggle Buttons */}
                              <div className="flex shrink-0 items-center gap-2.5 sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => handleSelectAnswer(q.id, true)}
                                  className={`flex h-10 min-w-[84px] items-center justify-center gap-1.5 rounded-full px-4  font-bold transition-all ${
                                    currentAnswer === true
                                      ? "bg-[#189D52] text-white shadow-xs"
                                      : "border border-[#D9D5E5] bg-[#FAF9FD] text-[#554F7A] hover:border-[#189D52] hover:text-[#189D52]"
                                  }`}
                                >
                                  <HugeiconsIcon
                                    icon={CheckmarkCircle02Icon}
                                    size={14}
                                  />
                                  <span>Yes</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSelectAnswer(q.id, false)
                                  }
                                  className={`flex h-10 min-w-[84px] items-center justify-center gap-1.5 rounded-full px-4  font-bold transition-all ${
                                    currentAnswer === false
                                      ? "bg-[#D9383A] text-white shadow-xs"
                                      : "border border-[#D9D5E5] bg-[#FAF9FD] text-[#554F7A] hover:border-[#D9383A] hover:text-[#D9383A]"
                                  }`}
                                >
                                  <HugeiconsIcon
                                    icon={Cancel01Icon}
                                    size={14}
                                  />
                                  <span>No</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-[#E3DEED] bg-white p-6 shadow-xs sm:flex-row sm:p-8">
                      <div>
                        <p className=" font-bold text-[#161058]">
                          Ready to finalize your application?
                        </p>
                        <p className=" text-[#554F7A]">
                          Submitting this questionnaire will immediately open
                          the payment checkout modal.
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={handleSubmitAssessment}
                        disabled={!allAnswered || isSubmitting}
                        className="h-12 w-full shrink-0 rounded-full bg-secondary px-8  font-bold text-[#111E2A] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#111E2A] border-t-transparent" />
                            <span>Submitting Application...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={LockKeyIcon} size={16} />
                            <span>
                              Submit Application & Continue to Payment
                            </span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </QueryCompLayout>
        </div>
      </main>

      {/* Stripe Payment Modal for Membership */}
      {isPaymentModalOpen && membershipId && (
        <StripePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Join ${detail?.gradeTitle || detail?.title || "Membership"}`}
          memberships={membershipsForModal}
          estimatedAmount={detail?.price ?? 0}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            router.push("/dashboard/purchase-history?payment=success");
          }}
        />
      )}

      <Footer />
    </div>
  );
}
