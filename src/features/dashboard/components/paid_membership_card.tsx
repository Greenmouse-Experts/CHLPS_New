"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  ShieldCheckIcon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import type { UserPaidMembership } from "../domain/repository/membership_repository";

interface PaidMembershipCardProps {
  membership: UserPaidMembership | null;
  isLoading: boolean;
}

export default function PaidMembershipCard({
  membership,
  isLoading,
}: PaidMembershipCardProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-sand bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="skeleton h-7 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-sand pt-4">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-9 w-28 rounded-lg" />
        </div>
      </div>
    );
  }

  // Active or pending membership
  if (membership) {
    const isActive =
      membership.status === "active" || membership.status === "confirmed";

    const expiryFormatted = membership.expiryDate
      ? new Date(membership.expiryDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Active Annual Term";

    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#CDA54E]/30 bg-gradient-to-br from-[#101D63] to-[#1E1758] p-6 text-white shadow-md">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#CDA54E]/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1  font-semibold uppercase tracking-wider text-[#CDA54E] backdrop-blur-sm">
                <HugeiconsIcon
                  icon={ShieldCheckIcon}
                  size={14}
                  color="currentColor"
                />
                Chartered Member
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5  font-medium ${
                  isActive
                    ? "bg-[#10B981]/20 text-[#6EE7B7]"
                    : "bg-[#F59E0B]/20 text-[#FCD34D]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-[#10B981]" : "bg-[#F59E0B]"
                  }`}
                />
                {isActive ? "Active in Good Standing" : "Pending Activation"}
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
              {membership.name}
            </h3>

            <div className="flex flex-wrap items-center gap-4  text-white/70">
              {membership.memberNumber && (
                <span>
                  Member ID:{" "}
                  <strong className="font-mono text-white">
                    {membership.memberNumber}
                  </strong>
                </span>
              )}
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={13}
                  color="currentColor"
                />
                Valid through: {expiryFormatted}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <Link
              href="/dashboard/membership"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#CDA54E] to-[#E5C77A] px-5 py-2.5  font-bold text-[#101D63] shadow-sm transition hover:brightness-105"
            >
              <span>View Membership</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2.2}
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No active membership yet - CTA card
  return (
    <div className="overflow-hidden rounded-2xl border border-sand bg-white p-6 shadow-sm transition hover:border-[#CDA54E]/40">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1E1758]/5 text-[#1E1758]">
            <HugeiconsIcon icon={Award01Icon} size={24} color="currentColor" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#101D63]">
                Professional Membership
              </h3>
              <span className="rounded-full bg-sand px-2 py-0.5  font-medium text-text/70">
                Not Enrolled
              </span>
            </div>
            <p className="max-w-xl  leading-relaxed text-text/70">
              Unlock chartered designations, access our industry resource
              library, and connect with Canada&apos;s leading loss prevention
              network.
            </p>
          </div>
        </div>

        <Link
          href="/membership"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1E1758] px-5 py-2.5  font-semibold text-white transition hover:bg-[#101D63]"
        >
          <span>Explore Grades</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            color="currentColor"
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );
}
