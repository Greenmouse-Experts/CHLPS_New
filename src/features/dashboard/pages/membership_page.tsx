"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Award01Icon,
  Clock01Icon,
  File01Icon,
  SecurityCheckIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Assets } from "@/lib/assets";
import { UrlTabber, useUrlTab, type TabItem } from "@/components/ui/UrlTabber";
import PageLoader from "@/components/PageLoader";
import {
  useUserMembershipApplications,
  useUserEnrolledMemberships,
} from "../domain/data/hooks/user_membership_hooks";
import {
  resolveMembershipBadge,
  type UserMembershipDetail,
  type UserEnrolledMembership,
} from "../domain/repository/membership_repository";
import { fetchPublicMemberships } from "@/features/membership/services/membership_service";
import type { Membership } from "@/types";

type EnrolledFilter = "all" | "active" | "cancelled" | "expired";
type ApplicationFilter =
  | "all"
  | "active"
  | "approved"
  | "pending_approval"
  | "rejected"
  | "expired"
  | "cancelled";

interface MembershipDashboardPageProps {
  initialTab?: "memberships" | "applications";
}

function MembershipDashboardContent({
  initialTab = "memberships",
}: MembershipDashboardPageProps) {
  const [activeTab, setActiveTab] = useUrlTab(initialTab, "tab");

  // Enrolled memberships query
  const enrolledQuery = useUserEnrolledMemberships();
  const enrolledList = enrolledQuery.data || [];
  const [enrolledFilter, setEnrolledFilter] = useState<EnrolledFilter>("all");

  // Applications query
  const {
    applications = [],
    isLoading: applicationsLoading,
    query: appQuery,
  } = useUserMembershipApplications();
  const [appFilter, setAppFilter] = useState<ApplicationFilter>("all");
  const [publicMemberships, setPublicMemberships] = useState<Membership[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(false);

  useEffect(() => {
    if (!applicationsLoading && applications.length === 0) {
      setLoadingTiers(true);
      fetchPublicMemberships()
        .then((data) => setPublicMemberships(data))
        .finally(() => setLoadingTiers(false));
    }
  }, [applicationsLoading, applications.length]);

  // Tab definitions
  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: "memberships",
        label: "My Memberships",
        icon: (
          <HugeiconsIcon
            icon={ShieldCheckIcon}
            size={16}
            color="currentColor"
          />
        ),
        count: enrolledList.length > 0 ? enrolledList.length : undefined,
      },
      {
        id: "applications",
        label: "My Applications",
        icon: (
          <HugeiconsIcon icon={File01Icon} size={16} color="currentColor" />
        ),
        count: applications.length > 0 ? applications.length : undefined,
      },
    ],
    [enrolledList.length, applications.length],
  );

  // Application Filtered list & counts
  const filteredApplications = useMemo(() => {
    if (appFilter === "active") {
      return applications.filter((app) => app.status === "active");
    }
    if (appFilter === "approved") {
      return applications.filter((app) => app.status === "approved");
    }
    if (appFilter === "pending_approval") {
      return applications.filter(
        (app) =>
          app.status === "pending_approval" ||
          app.status === "under_review" ||
          app.status === "pending",
      );
    }
    if (appFilter === "rejected") {
      return applications.filter((app) => app.status === "rejected");
    }
    if (appFilter === "expired") {
      return applications.filter((app) => app.status === "expired");
    }
    if (appFilter === "cancelled") {
      return applications.filter((app) => app.status === "cancelled");
    }
    return applications;
  }, [applications, appFilter]);

  const activeAppCount = useMemo(
    () => applications.filter((a) => a.status === "active").length,
    [applications],
  );
  const approvedAppCount = useMemo(
    () => applications.filter((a) => a.status === "approved").length,
    [applications],
  );
  const pendingApprovalAppCount = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.status === "pending_approval" ||
          a.status === "under_review" ||
          a.status === "pending",
      ).length,
    [applications],
  );

  return (
    <DashboardLayout title="Membership & Applications">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0D154B] sm:text-2xl">
              Professional Memberships & Applications
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Manage your active designations, digital credentials, and track
              the status of submitted applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

        {/* Primary URL Tabber Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-base-200 pb-4">
          <UrlTabber
            tabs={tabs}
            defaultTab={initialTab}
            paramKey="tab"
            variant="segmented"
          />
        </div>

        {/* Tab 1: My Enrolled Memberships */}
        {activeTab === "memberships" && (
          <div className="space-y-6">
            <PageLoader query={enrolledQuery.query}>
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
                        subscriptions currently enrolled. Check your application
                        status or explore membership grades.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveTab("applications")}
                          className="btn btn-primary btn-md rounded-xl normal-case text-sm font-semibold gap-2 shadow-sm"
                        >
                          <span>Track Applications</span>
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={16}
                            color="currentColor"
                          />
                        </button>
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
                  if (enrolledFilter === "all") return true;
                  if (enrolledFilter === "active")
                    return item.status === "active";
                  if (enrolledFilter === "cancelled")
                    return (
                      item.status === "cancelled" || item.status === "canceled"
                    );
                  if (enrolledFilter === "expired")
                    return item.status === "expired";
                  return true;
                });

                return (
                  <div className="space-y-6">
                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-base-200/80 pb-3">
                      <button
                        type="button"
                        onClick={() => setEnrolledFilter("all")}
                        className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                          enrolledFilter === "all"
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
                        onClick={() => setEnrolledFilter("active")}
                        className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                          enrolledFilter === "active"
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
                          onClick={() => setEnrolledFilter("cancelled")}
                          className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                            enrolledFilter === "cancelled"
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
                          onClick={() => setEnrolledFilter("expired")}
                          className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                            enrolledFilter === "expired"
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

                    {/* Cards Grid */}
                    {filteredList.length === 0 ? (
                      <div className="card border border-base-200/80 bg-white p-8 text-center shadow-xs">
                        <p className="text-sm font-medium text-base-content/70">
                          No memberships matching &quot;{enrolledFilter}&quot;.
                        </p>
                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            onClick={() => setEnrolledFilter("all")}
                            className="btn btn-ghost btn-sm rounded-xl normal-case text-xs font-semibold text-[#0D154B]"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredList.map((mem) => (
                          <EnrolledMembershipCard
                            key={mem.id}
                            membership={mem}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
            </PageLoader>
          </div>
        )}

        {/* Tab 2: My Applications */}
        {activeTab === "applications" && (
          <div className="space-y-8">
            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                      Total Applications
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#0D154B]">
                      {applicationsLoading ? "-" : applications.length}
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon
                      icon={File01Icon}
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
                      Active Memberships
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#10B981]">
                      {applicationsLoading ? "-" : activeAppCount}
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
                      Approved
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-emerald-600">
                      {applicationsLoading ? "-" : approvedAppCount}
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                    <HugeiconsIcon
                      icon={SecurityCheckIcon}
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
                      Pending Approval
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#D97706]">
                      {applicationsLoading ? "-" : pendingApprovalAppCount}
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={20}
                      color="currentColor"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Applications Content */}
            {applicationsLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="skeleton h-96 rounded-[28px]" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="space-y-8">
                <div className="card border border-base-200/80 bg-white p-8 text-center shadow-xs sm:p-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C99E4A]/15 text-[#C99E4A]">
                    <HugeiconsIcon
                      icon={ShieldCheckIcon}
                      size={32}
                      color="currentColor"
                    />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#0D154B] sm:text-2xl">
                    No Membership Applications Yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
                    You haven&apos;t applied for any membership grade yet.
                    Complete an eligibility assessment to join the Association
                    of Chartered Loss Prevention Specialists.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Link
                      href="/membership"
                      className="btn btn-primary btn-md rounded-xl normal-case text-sm font-semibold gap-2 shadow-sm"
                    >
                      <span>Explore Membership Grades</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={16}
                        color="currentColor"
                      />
                    </Link>
                  </div>
                </div>

                {/* Available Categories */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#0D154B]">
                      Available Membership Categories
                    </h3>
                    <p className="text-sm text-base-content/70">
                      Select a grade suited to your career stage and experience
                      to apply:
                    </p>
                  </div>

                  {loadingTiers ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton h-56 rounded-2xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {publicMemberships.map((tier) => (
                        <div
                          key={tier.id}
                          className="card border border-base-200/80 bg-white p-6 shadow-xs transition hover:border-[#C99E4A]/50 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="badge badge-ghost text-xs font-semibold text-base-content/70">
                              {tier.duration || "Annual"}
                            </span>
                            <span className="text-base font-bold text-[#0D154B]">
                              {tier.currency}{" "}
                              {Number(tier.price || 0).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="mt-3 text-base font-bold text-[#0D154B]">
                            {tier.name}
                          </h4>
                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-base-content/70">
                            {tier.description}
                          </p>
                          <Link
                            href={`/membership/${tier.slug || tier.id}`}
                            className="btn btn-outline btn-sm mt-5 rounded-xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
                          >
                            <span>View Requirements & Apply</span>
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
            ) : (
              <div className="space-y-6">
                {/* Applications Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 border-b border-base-200 pb-3">
                  <button
                    type="button"
                    onClick={() => setAppFilter("all")}
                    className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                      appFilter === "all"
                        ? "btn-primary text-white"
                        : "btn-ghost text-base-content/70 hover:text-base-content"
                    }`}
                  >
                    All ({applications.length})
                  </button>
                  {activeAppCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAppFilter("active")}
                      className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                        appFilter === "active"
                          ? "btn-primary text-white"
                          : "btn-ghost text-base-content/70 hover:text-base-content"
                      }`}
                    >
                      Active ({activeAppCount})
                    </button>
                  )}
                  {approvedAppCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAppFilter("approved")}
                      className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                        appFilter === "approved"
                          ? "btn-primary text-white"
                          : "btn-ghost text-base-content/70 hover:text-base-content"
                      }`}
                    >
                      Approved ({approvedAppCount})
                    </button>
                  )}
                  {pendingApprovalAppCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAppFilter("pending_approval")}
                      className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                        appFilter === "pending_approval"
                          ? "btn-primary text-white"
                          : "btn-ghost text-base-content/70 hover:text-base-content"
                      }`}
                    >
                      Pending Approval ({pendingApprovalAppCount})
                    </button>
                  )}
                </div>

                {/* Applications Cards Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredApplications.map((app) => (
                    <MembershipApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function MembershipDashboardPage(
  props: MembershipDashboardPageProps,
) {
  return (
    <Suspense
      fallback={
        <DashboardLayout title="Membership & Applications">
          <div className="flex min-h-[400px] items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[#0D154B]" />
          </div>
        </DashboardLayout>
      }
    >
      <MembershipDashboardContent {...props} />
    </Suspense>
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

function MembershipApplicationCard({
  application,
}: {
  application: UserMembershipDetail;
}) {
  const badgeSrc = application.badge || Assets.icons.logo;
  const isRemote =
    badgeSrc.startsWith("http://") || badgeSrc.startsWith("https://");

  const isCorporate =
    (application.name || "").toLowerCase().includes("corporate") ||
    (application.slug || "").toLowerCase().includes("corporate");

  const cleanName = (application.name || "").replace(/Member$/i, "").trim();
  const displayName = cleanName.toLowerCase().endsWith("membership")
    ? cleanName
    : `${cleanName} Membership`;

  const statusConfig = useMemo(() => {
    switch (application.status) {
      case "active":
        return {
          label: "Active",
          badgeClass: "badge-success text-white",
          dotColor: "bg-white",
          actionText: "View Membership",
        };
      case "approved":
        return {
          label: "Approved",
          badgeClass: "bg-emerald-600 text-white border-emerald-600",
          dotColor: "bg-white",
          actionText: "Complete Enrollment",
        };
      case "expired":
        return {
          label: "Expired",
          badgeClass: "badge-ghost text-base-content/70 border-base-300",
          dotColor: "bg-base-content/50",
          actionText: "Renew Membership",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          badgeClass: "badge-neutral text-white",
          dotColor: "bg-white",
          actionText: "View Details",
        };
      case "rejected":
        return {
          label: "Rejected",
          badgeClass: "badge-error text-white",
          dotColor: "bg-white",
          actionText: "View Details",
        };
      case "pending_approval":
      case "under_review":
      case "pending":
      default:
        return {
          label: "Pending Approval",
          badgeClass: "badge-warning text-amber-950",
          dotColor: "bg-amber-900",
          actionText: "Track Application",
        };
    }
  }, [application.status]);

  const priceText = useMemo(() => {
    if (application.price != null && !isNaN(Number(application.price))) {
      const cur =
        application.currency === "USD"
          ? "$"
          : application.currency === "NGN"
            ? "₦"
            : "CA$";
      return `${cur}${Number(application.price).toLocaleString()}`;
    }
    return "CA$595";
  }, [application.price, application.currency]);

  const description =
    application.description ||
    "The globally recognized IFPO certification — the gold standard for protection professionals.";

  const href = `/dashboard/membership/${application.id}`;

  return (
    <article className="card group relative flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-[#C99E4A] bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Top White Section */}
      <div className="flex flex-1 flex-col items-center justify-between bg-white px-5 pt-5 pb-6 text-center sm:px-6 sm:pt-6">
        <div className="flex w-full items-center justify-between gap-2 pb-3">
          <span className="font-mono text-xs font-semibold text-base-content/60">
            Ref:{" "}
            {application.memberNumber ||
              application.id.slice(0, 8).toUpperCase()}
          </span>
          <span
            className={`badge ${statusConfig.badgeClass} gap-1.5 px-2.5 py-1 text-xs font-semibold shadow-xs`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`}
            />
            {statusConfig.label}
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
              alt={`${application.name} badge`}
              fill
              sizes="(max-width: 640px) 96px, 112px"
              unoptimized={isRemote}
              className={`p-2 ${isCorporate ? "object-cover object-left" : "object-contain"}`}
            />
          </div>

          <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-[#161058] transition-colors duration-200 group-hover/link:text-[#0A1542] sm:text-2xl">
            {displayName}
          </h3>
        </Link>
      </div>

      {/* Bottom Dark Navy Section */}
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
          <div className="mb-3 grid w-full grid-cols-2 gap-2 rounded-xl bg-white/10 p-2.5 text-xs text-white/90 backdrop-blur-xs">
            <div className="flex flex-col items-start px-1 text-left">
              <span className="text-white/60">Applied Date</span>
              <span className="font-semibold text-white">
                {application.appliedDate
                  ? new Date(application.appliedDate).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : "Recent"}
              </span>
            </div>
            <div className="flex flex-col items-end px-1 text-right">
              <span className="text-white/60">
                {application.status === "rejected"
                  ? "Decision"
                  : "Validity Term"}
              </span>
              <span className="font-semibold text-white">
                {application.status === "rejected"
                  ? "Rejected"
                  : application.duration || "1 Year"}
              </span>
            </div>
          </div>

          {application.status === "rejected" && application.rejectReason && (
            <div className="mb-3 w-full rounded-xl border border-rose-400/30 bg-rose-950/40 p-2.5 text-left text-xs text-rose-200">
              <span className="font-semibold text-rose-100">Reason: </span>
              <span className="line-clamp-2">{application.rejectReason}</span>
            </div>
          )}

          <p className="min-h-[40px] max-w-[300px] text-center text-sm leading-relaxed text-white/90 line-clamp-2">
            {description}
          </p>

          <div className="my-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {priceText}
          </div>

          <Link
            href={href}
            className="btn btn-secondary btn-block h-12 min-h-12 rounded-xl text-base font-bold text-[#0B0E33] normal-case shadow-sm transition-all duration-200 hover:brightness-95 flex items-center justify-center gap-1.5"
          >
            <span>{statusConfig.actionText}</span>
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
