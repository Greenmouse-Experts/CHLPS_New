"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  Download01Icon,
  Invoice01Icon,
  SecurityCheckIcon,
  ShieldCheckIcon,
  ArrowRight01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Assets } from "@/lib/assets";
import { RootState } from "@/lib/store/store";
import { useUserMembership } from "../domain/data/hooks/user_membership_hooks";
import { fetchPublicMemberships } from "@/features/membership/services/membership_service";
import type { Membership } from "@/types";

export default function MembershipDashboardPage() {
  const user = useSelector((state: RootState) => state.user);
  const { membership, isLoading } = useUserMembership();
  const [publicMemberships, setPublicMemberships] = useState<Membership[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  // If no membership found, load public membership grades for browsing
  useEffect(() => {
    if (!isLoading && !membership) {
      setLoadingGrades(true);
      fetchPublicMemberships()
        .then((data) => setPublicMemberships(data))
        .finally(() => setLoadingGrades(false));
    }
  }, [isLoading, membership]);

  const copyMemberId = () => {
    if (membership?.memberNumber) {
      navigator.clipboard.writeText(membership.memberNumber);
      toast.success("Member ID copied to clipboard!");
    }
  };

  return (
    <DashboardLayout title="My Membership">
      {isLoading ? (
        <MembershipSkeleton />
      ) : membership ? (
        <div className="space-y-8">
          {/* Member Card & Summary Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Realistic Digital Membership Card */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-[#CDA54E]/40 bg-gradient-to-br from-[#0B1542] via-[#101D63] to-[#1E1758] p-6 text-white shadow-xl sm:p-8">
                {/* Background decorative patterns */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#CDA54E]/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#10B981]/10 blur-3xl" />

                {/* Card Top: Association Header & Badge */}
                <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-sm">
                      <Image
                        src={Assets.icons.logo}
                        alt="ChLPS Canada"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-[#CDA54E] uppercase">
                        Chartered Body
                      </p>
                      <h4 className="text-sm font-bold text-white sm:text-base">
                        Association of Chartered Loss Prevention Specialists
                      </h4>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/20 px-3 py-1 text-xs font-semibold text-[#6EE7B7] backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    Active Member
                  </span>
                </div>

                {/* Card Body: Member Name & Grade */}
                <div className="relative z-10 my-6 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                    Registered Member
                  </p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {user.fullName ||
                      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      "Chartered Member"}
                  </h2>
                  <p className="text-sm font-semibold text-[#E5C77A]">
                    {membership.name}
                  </p>
                </div>

                {/* Card Footer: Member ID, Expiry & Verification */}
                <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
                  <div>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-white/50">
                      Member Identification
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-base font-bold tracking-wider text-white">
                        {membership.memberNumber}
                      </span>
                      <button
                        type="button"
                        onClick={copyMemberId}
                        className="rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                        title="Copy Member ID"
                      >
                        <HugeiconsIcon
                          icon={Copy01Icon}
                          size={15}
                          color="currentColor"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-white/50">
                      Valid Through
                    </span>
                    <span className="mt-1 block font-mono text-sm font-bold text-white">
                      {membership.expiryDate
                        ? new Date(membership.expiryDate).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )
                        : "Annual Validity"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Membership Quick Facts & Status */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-sand bg-white p-6 shadow-sm lg:col-span-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-sand pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CDA54E]/10 text-[#CDA54E]">
                    <HugeiconsIcon
                      icon={SecurityCheckIcon}
                      size={20}
                      color="currentColor"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#101D63]">
                      Membership Standing
                    </h3>
                    <p className="text-xs text-text/60">
                      Official verification & standing
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-cream/70 p-3">
                    <dt className="text-xs text-text/60">Standing</dt>
                    <dd className="mt-1 font-semibold text-[#10B981]">
                      In Good Standing
                    </dd>
                  </div>
                  <div className="rounded-xl bg-cream/70 p-3">
                    <dt className="text-xs text-text/60">Term Duration</dt>
                    <dd className="mt-1 font-semibold text-[#101D63]">
                      {membership.duration || "1 Year"}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-cream/70 p-3">
                    <dt className="text-xs text-text/60">Auto-Renewal</dt>
                    <dd className="mt-1 font-semibold text-[#101D63]">
                      {membership.autoRenewal ? "Enabled" : "Manual"}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-cream/70 p-3">
                    <dt className="text-xs text-text/60">Enrolled Since</dt>
                    <dd className="mt-1 font-semibold text-[#101D63]">
                      {membership.startDate
                        ? new Date(membership.startDate).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "Current Year"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/dashboard/purchase-history"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-sm font-semibold text-[#101D63] transition hover:bg-cream"
                >
                  <HugeiconsIcon
                    icon={Invoice01Icon}
                    size={16}
                    color="currentColor"
                  />
                  <span>View Receipts & Orders</span>
                </Link>
                <Link
                  href="/dashboard/support"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-text/60 transition hover:text-text"
                >
                  Need assistance with your membership? Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Member Benefits Section */}
          <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-[#101D63]">
                  Included Member Privileges & Benefits
                </h3>
                <p className="text-xs text-text/60">
                  Exclusive advantages available to your membership grade
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#CDA54E]/15 px-3 py-1 text-xs font-bold text-[#9A7326]">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={14}
                  color="currentColor"
                />
                Chartered Benefits
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(membership.benefits && membership.benefits.length > 0
                ? membership.benefits
                : [
                    "Authorized use of ChLPS post-nominal designations",
                    "Unlimited access to Loss Prevention technical papers and standards",
                    "Member-exclusive discounts on professional certification exams",
                    "Invitations to international webinars and peer knowledge roundtables",
                    "Listed in the official ChLPS Canada Registered Specialist Directory",
                    "Voting rights at the Association Annual General Meeting (AGM)",
                  ]
              ).map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-sand bg-cream/30 p-4 transition hover:bg-cream/60"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981]">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={14}
                      color="currentColor"
                    />
                  </div>
                  <span className="text-xs leading-relaxed font-medium text-[#101D63]">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate & Digital Credential Section */}
          <div className="overflow-hidden rounded-2xl border border-sand bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#CDA54E]/15 text-[#CDA54E]">
                  <HugeiconsIcon
                    icon={Award01Icon}
                    size={24}
                    color="currentColor"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#101D63]">
                    Official Membership Certificate
                  </h3>
                  <p className="max-w-xl text-xs text-text/70 sm:text-sm">
                    Your authenticated digital certificate confirms active
                    standing with the Association of Chartered Loss Prevention
                    Specialists.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Certificate download is being prepared. It will be emailed to your registered address.",
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#101D63] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E1758]"
                >
                  <HugeiconsIcon
                    icon={Download01Icon}
                    size={16}
                    color="currentColor"
                  />
                  <span>Download Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: No active membership yet */
        <div className="space-y-8">
          <div className="rounded-2xl border border-sand bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CDA54E]/15 text-[#CDA54E]">
              <HugeiconsIcon
                icon={ShieldCheckIcon}
                size={32}
                color="currentColor"
              />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#101D63] sm:text-2xl">
              No Active Membership Found
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-text/70">
              You are currently registered with a student account. Join the
              Association of Chartered Loss Prevention Specialists to unlock
              certified credentials, exclusive standards, and professional
              development.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 rounded-xl bg-[#101D63] px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-[#1E1758]"
              >
                <span>Browse All Membership Grades</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>

          {/* Available Membership Grades Carousel / Grid */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#101D63]">
                Available Membership Categories
              </h3>
              <p className="text-xs text-text/60">
                Select a grade suited to your career stage and experience
              </p>
            </div>

            {loadingGrades ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-64 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {publicMemberships.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex flex-col justify-between rounded-2xl border border-sand bg-white p-6 shadow-sm transition hover:shadow-md hover:border-[#CDA54E]/50"
                  >
                    <div className="space-y-3">
                      <span className="inline-block rounded-full bg-cream px-3 py-1 text-[11px] font-semibold text-[#101D63]">
                        {tier.duration || "Annual"}
                      </span>
                      <h4 className="text-base font-bold text-[#101D63] line-clamp-1">
                        {tier.name}
                      </h4>
                      <p className="text-xs text-text/70 line-clamp-3">
                        {tier.description}
                      </p>
                      <div className="pt-2">
                        <span className="text-2xl font-black text-[#101D63]">
                          {tier.currency} {Number(tier.price).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={
                        tier.slug ? `/membership/${tier.slug}` : "/membership"
                      }
                      className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-sand bg-cream/50 py-2.5 text-xs font-bold text-[#101D63] transition hover:bg-[#101D63] hover:text-white"
                    >
                      <span>Learn & Apply</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={14}
                        color="currentColor"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function MembershipSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="skeleton h-80 rounded-2xl lg:col-span-7" />
        <div className="skeleton h-80 rounded-2xl lg:col-span-5" />
      </div>
      <div className="skeleton h-48 rounded-2xl" />
      <div className="skeleton h-32 rounded-2xl" />
    </div>
  );
}
