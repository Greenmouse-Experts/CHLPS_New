"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Assets } from "@/lib/assets";
import PageLoader from "@/components/PageLoader";
import { useUserEnrolledMemberships } from "../domain/data/hooks/user_membership_hooks";
import {
  resolveMembershipBadge,
  type UserEnrolledMembership,
} from "../domain/repository/membership_repository";

type FilterStatus = "all" | "active" | "cancelled" | "expired";

export default function MyMembershipsPage() {
  const { query } = useUserEnrolledMemberships();
  const [filter, setFilter] = useState<FilterStatus>("all");

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

        {/* Content Section */}
        <PageLoader query={query}>
          {(data: UserEnrolledMembership[]) => {
            const list = Array.isArray(data) ? data : [];

            if (list.length === 0) {
              return (
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
                    You do not have any active or confirmed membership
                    subscriptions currently enrolled. Submit an application or
                    check your existing applications to get started.
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
              );
            }

            // Calculate counts for filters
            const activeCount = list.filter(
              (m) => m.status === "active",
            ).length;
            const cancelledCount = list.filter(
              (m) => m.status === "cancelled" || m.status === "canceled",
            ).length;
            const expiredCount = list.filter(
              (m) => m.status === "expired",
            ).length;

            const filteredList = list.filter((item) => {
              if (filter === "all") return true;
              if (filter === "active") return item.status === "active";
              if (filter === "cancelled")
                return (
                  item.status === "cancelled" || item.status === "canceled"
                );
              if (filter === "expired") return item.status === "expired";
              return true;
            });

            return (
              <div className="space-y-6">
                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-base-200/80 pb-3">
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                      filter === "all"
                        ? "btn-primary shadow-xs"
                        : "btn-ghost text-base-content/70 hover:bg-base-200"
                    }`}
                  >
                    <span>All</span>
                    <span className="badge badge-sm rounded-lg opacity-80">
                      {list.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilter("active")}
                    className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                      filter === "active"
                        ? "btn-primary shadow-xs"
                        : "btn-ghost text-base-content/70 hover:bg-base-200"
                    }`}
                  >
                    <span>Active</span>
                    <span className="badge badge-sm rounded-lg opacity-80">
                      {activeCount}
                    </span>
                  </button>

                  {cancelledCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setFilter("cancelled")}
                      className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                        filter === "cancelled"
                          ? "btn-primary shadow-xs"
                          : "btn-ghost text-base-content/70 hover:bg-base-200"
                      }`}
                    >
                      <span>Cancelled</span>
                      <span className="badge badge-sm rounded-lg opacity-80">
                        {cancelledCount}
                      </span>
                    </button>
                  )}

                  {expiredCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setFilter("expired")}
                      className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                        filter === "expired"
                          ? "btn-primary shadow-xs"
                          : "btn-ghost text-base-content/70 hover:bg-base-200"
                      }`}
                    >
                      <span>Expired</span>
                      <span className="badge badge-sm rounded-lg opacity-80">
                        {expiredCount}
                      </span>
                    </button>
                  )}
                </div>

                {/* Filtered Grid or Empty Filter state */}
                {filteredList.length === 0 ? (
                  <div className="card border border-base-200/80 bg-white p-8 text-center shadow-xs">
                    <p className="text-sm font-medium text-base-content/70">
                      No memberships matching the &quot;{filter}&quot; filter.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setFilter("all")}
                        className="btn btn-ghost btn-sm rounded-xl normal-case text-xs font-semibold text-[#0D154B]"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredList.map((mem) => (
                      <EnrolledMembershipCard key={mem.id} membership={mem} />
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        </PageLoader>
      </div>
    </DashboardLayout>
  );
}

function EnrolledMembershipCard({
  membership,
}: {
  membership: UserEnrolledMembership;
}) {
  const mem = membership.membership;
  const badgeSrc = resolveMembershipBadge(
    mem?.slug || mem?.name,
    mem?.image || mem?.certificationImage,
  );
  const isRemote =
    badgeSrc.startsWith("http://") || badgeSrc.startsWith("https://");

  const title = mem?.name || "Professional Membership";
  const cleanName = title.replace(/Member$/i, "").trim();
  const displayName = cleanName.toLowerCase().endsWith("membership")
    ? cleanName
    : `${cleanName} Membership`;

  const status = (membership.status || "").toLowerCase();
  const isActive = status === "active" || status === "confirmed";
  const isCancelled = status === "cancelled" || status === "canceled";
  const isExpired = status === "expired";

  const memberId =
    membership.memberNumber ||
    (membership.applicationId
      ? `CHLPS-${membership.applicationId.slice(0, 8).toUpperCase()}`
      : `CHLPS-${membership.id.slice(0, 8).toUpperCase()}`);

  const startDateFormatted =
    membership.startDate || membership.createdDate
      ? new Date(
          membership.startDate || membership.createdDate,
        ).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Active";

  const expiryFormatted = isCancelled
    ? "Cancelled"
    : membership.endDate
      ? new Date(membership.endDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : mem?.duration || "1 Year Term";

  const targetId =
    membership.applicationId || mem?.slug || mem?.id || membership.id;
  const href = `/dashboard/membership/${targetId}`;

  return (
    <article className="card group relative flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-[#C99E4A] bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Top Section */}
      <div className="flex flex-1 flex-col items-center justify-between bg-white px-5 pt-5 pb-6 text-center sm:px-6 sm:pt-6">
        <div className="flex w-full items-center justify-between gap-2 pb-3">
          <span className="font-mono text-xs font-semibold text-base-content/60">
            ID: {memberId}
          </span>
          <span
            className={`badge ${
              isActive
                ? "badge-success text-white"
                : isCancelled
                  ? "badge-error text-white"
                  : isExpired
                    ? "badge-ghost text-base-content/70"
                    : "badge-neutral text-white"
            } gap-1.5 px-2.5 py-1 text-xs font-semibold shadow-xs`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-white animate-pulse" : "bg-white"
              }`}
            />
            {isActive
              ? "Active"
              : isCancelled
                ? "Cancelled"
                : isExpired
                  ? "Expired"
                  : status}
          </span>
        </div>

        <Link
          href={href}
          className="group/link flex w-full flex-col items-center"
          aria-label={`View details for ${displayName}`}
        >
          <div className="relative mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[#C99E4A] bg-white p-2.5 shadow-xs transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28">
            <Image
              src={badgeSrc}
              alt={`${title} badge`}
              fill
              sizes="(max-width: 640px) 96px, 112px"
              unoptimized={isRemote}
              className="object-contain p-2"
            />
          </div>

          <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-[#161058] transition-colors duration-200 group-hover/link:text-[#0A1542] sm:text-2xl">
            {title}
          </h3>
          {mem?.duration && (
            <p className="mt-1 text-xs font-medium text-base-content/60">
              {mem.duration} Subscription
            </p>
          )}
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="relative flex flex-col items-center overflow-hidden bg-[#0B0E33] px-5 py-6 text-center sm:px-6 sm:py-7">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={Assets.images.membershipCardBg}
            alt=""
            fill
            className="object-cover object-center opacity-80"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center">
          <div className="mb-4 grid w-full grid-cols-2 gap-2 rounded-xl bg-white/10 p-2.5 text-xs text-white/90 backdrop-blur-xs">
            <div className="flex flex-col items-start px-1 text-left">
              <span className="text-white/60">Enrolled Date</span>
              <span className="font-semibold text-white">
                {startDateFormatted}
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
              {isActive
                ? "View Membership Credentials"
                : isCancelled
                  ? "View Application Details"
                  : "View Membership Details"}
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
