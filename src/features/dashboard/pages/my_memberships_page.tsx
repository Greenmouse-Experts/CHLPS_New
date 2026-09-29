"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Award01Icon,
  Clock01Icon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Assets } from "@/lib/assets";
import { useUserEnrolledMemberships } from "../domain/data/hooks/user_membership_hooks";
import type { UserMembershipDetail } from "../domain/repository/membership_repository";

export default function MyMembershipsPage() {
  const { memberships, isLoading, refetch } = useUserEnrolledMemberships();
  const [filter, setFilter] = useState<
    "all" | "active" | "expired" | "cancelled"
  >("all");

  const filteredMemberships = useMemo(() => {
    if (filter === "active") {
      return memberships.filter((m) => m.status === "active");
    }
    if (filter === "expired") {
      return memberships.filter((m) => m.status === "expired");
    }
    if (filter === "cancelled") {
      return memberships.filter((m) => m.status === "cancelled");
    }
    return memberships;
  }, [memberships, filter]);

  const activeCount = useMemo(
    () => memberships.filter((m) => m.status === "active").length,
    [memberships],
  );

  const expiredCount = useMemo(
    () => memberships.filter((m) => m.status === "expired").length,
    [memberships],
  );

  const cancelledCount = useMemo(
    () => memberships.filter((m) => m.status === "cancelled").length,
    [memberships],
  );

  return (
    <DashboardLayout title="My Memberships">
      <div className="space-y-8">
        {/* Page Subheader */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0D154B] sm:text-2xl">
              My Active Memberships
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Manage your enrolled professional memberships, view digital
              credentials, and review certificate standings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/my-applications"
              className="btn btn-ghost btn-sm rounded-xl normal-case text-xs font-semibold text-[#0D154B] hover:bg-base-200"
            >
              <span>View Applications</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                color="currentColor"
              />
            </Link>
            <Link
              href="/membership"
              className="btn btn-outline btn-sm rounded-xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
            >
              <span>Explore All Grades</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                color="currentColor"
              />
            </Link>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Total Enrolled
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#0D154B]">
                  {isLoading ? "-" : memberships.length}
                </h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon
                  icon={ShieldCheckIcon}
                  size={20}
                  color="currentColor"
                />
              </div>
            </div>
          </div>

          <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Active in Good Standing
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#10B981]">
                  {isLoading ? "-" : activeCount}
                </h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
                <HugeiconsIcon
                  icon={Award01Icon}
                  size={20}
                  color="currentColor"
                />
              </div>
            </div>
          </div>

          <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Expired / Cancelled
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-base-content/80">
                  {isLoading ? "-" : expiredCount + cancelledCount}
                </h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-base-200 text-base-content/70">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={20}
                  color="currentColor"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-80 flex-col justify-between rounded-2xl border border-base-200 bg-white p-6 shadow-xs"
              >
                <div className="space-y-4">
                  <div className="h-6 w-1/3 animate-pulse rounded-lg bg-base-200" />
                  <div className="h-10 w-3/4 animate-pulse rounded-lg bg-base-200" />
                </div>
                <div className="h-10 w-full animate-pulse rounded-xl bg-base-200" />
              </div>
            ))}
          </div>
        ) : memberships.length === 0 ? (
          /* Empty state */
          <div className="card border border-base-200/80 bg-white p-8 text-center shadow-xs sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C99E4A]/15 text-[#C99E4A]">
              <HugeiconsIcon
                icon={ShieldCheckIcon}
                size={32}
                color="currentColor"
              />
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#0D154B] sm:text-2xl">
              No Enrolled Memberships Yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              You do not have any active or confirmed membership subscriptions
              currently enrolled. Submit an application or check your existing
              applications to get started.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/my-applications"
                className="btn btn-primary btn-md rounded-xl normal-case text-sm font-semibold gap-2 shadow-sm"
              >
                <span>Track Applications</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  color="currentColor"
                />
              </Link>
              <Link
                href="/membership"
                className="btn btn-outline btn-md rounded-xl border-base-300 normal-case text-sm font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
              >
                <span>Explore Membership Grades</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-base-200 pb-3">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                  filter === "all"
                    ? "btn-primary text-white"
                    : "btn-ghost text-base-content/70 hover:text-base-content"
                }`}
              >
                All ({memberships.length})
              </button>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("active")}
                  className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                    filter === "active"
                      ? "btn-primary text-white"
                      : "btn-ghost text-base-content/70 hover:text-base-content"
                  }`}
                >
                  Active ({activeCount})
                </button>
              )}
              {cancelledCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("cancelled")}
                  className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                    filter === "cancelled"
                      ? "btn-primary text-white"
                      : "btn-ghost text-base-content/70 hover:text-base-content"
                  }`}
                >
                  Cancelled ({cancelledCount})
                </button>
              )}
              {expiredCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("expired")}
                  className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                    filter === "expired"
                      ? "btn-primary text-white"
                      : "btn-ghost text-base-content/70 hover:text-base-content"
                  }`}
                >
                  Expired ({expiredCount})
                </button>
              )}
            </div>

            {/* Memberships Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMemberships.map((mem) => (
                <EnrolledMembershipCard key={mem.id} membership={mem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function EnrolledMembershipCard({
  membership,
}: {
  membership: UserMembershipDetail;
}) {
  const badgeSrc = membership.badge || Assets.icons.logo;
  const isRemote =
    badgeSrc.startsWith("http://") || badgeSrc.startsWith("https://");

  const cleanName = (membership.name || "").replace(/Member$/i, "").trim();
  const displayName = cleanName.toLowerCase().endsWith("membership")
    ? cleanName
    : `${cleanName} Membership`;

  const isActive = membership.status === "active";
  const isCancelled = membership.status === "cancelled";
  const isExpired = membership.status === "expired";

  const expiryFormatted = membership.expiryDate
    ? new Date(membership.expiryDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : isCancelled
      ? "Cancelled"
      : "1 Year Term";

  const href = `/dashboard/membership/${membership.id}`;

  return (
    <article className="card group relative flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-[#C99E4A] bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Top Section */}
      <div className="flex flex-1 flex-col items-center justify-between bg-white px-5 pt-5 pb-6 text-center sm:px-6 sm:pt-6">
        <div className="flex w-full items-center justify-between gap-2 pb-3">
          <span className="font-mono text-xs font-semibold text-base-content/60">
            ID:{" "}
            {membership.memberNumber || membership.id.slice(0, 8).toUpperCase()}
          </span>
          <span
            className={`badge ${
              isActive
                ? "badge-success text-white"
                : isExpired
                  ? "badge-ghost text-base-content/70"
                  : "badge-neutral text-white"
            } gap-1.5 px-2.5 py-1 text-xs font-semibold shadow-xs`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {isActive ? "Active" : isExpired ? "Expired" : "Cancelled"}
          </span>
        </div>

        <Link
          href={href}
          className="group/link flex flex-col items-center w-full"
          aria-label={`View details for ${displayName}`}
        >
          <div className="relative mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[#C99E4A] bg-white p-2.5 shadow-xs transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28">
            <Image
              src={badgeSrc}
              alt={`${membership.name} badge`}
              fill
              sizes="(max-width: 640px) 96px, 112px"
              unoptimized={isRemote}
              className="p-2 object-contain"
            />
          </div>

          <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-[#161058] transition-colors duration-200 group-hover/link:text-[#0A1542] sm:text-2xl">
            {displayName}
          </h3>
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="relative flex flex-col items-center overflow-hidden bg-[#0B0E33] px-5 py-6 text-center sm:px-6 sm:py-7">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={Assets.images.membershipCardBg}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center">
          <div className="mb-4 grid w-full grid-cols-2 gap-2 rounded-xl bg-white/10 p-2.5 text-xs text-white/90 backdrop-blur-xs">
            <div className="flex flex-col items-start px-1 text-left">
              <span className="text-white/60">Enrolled Date</span>
              <span className="font-semibold text-white">
                {membership.startDate || membership.appliedDate
                  ? new Date(
                      membership.startDate || membership.appliedDate!,
                    ).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent"}
              </span>
            </div>
            <div className="flex flex-col items-end px-1 text-right">
              <span className="text-white/60">
                {isCancelled ? "Status" : "Valid Until"}
              </span>
              <span className="font-semibold text-white">
                {expiryFormatted}
              </span>
            </div>
          </div>

          <Link
            href={href}
            className="btn btn-secondary btn-block h-12 min-h-12 rounded-xl text-base font-bold text-[#0B0E33] normal-case shadow-sm transition-all duration-200 hover:brightness-95 flex items-center justify-center gap-1.5"
          >
            <span>
              {isCancelled ? "View Details" : "View Membership Credentials"}
            </span>
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={18}
              color="#0B0E33"
              strokeWidth={2.5}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
