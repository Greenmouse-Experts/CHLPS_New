"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Award01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  File01Icon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Assets } from "@/lib/assets";
import { useUserMembershipApplications } from "../domain/data/hooks/user_membership_hooks";
import { fetchPublicMemberships } from "@/features/membership/services/membership_service";
import type { Membership } from "@/types";
import type { UserMembershipDetail } from "../domain/repository/membership_repository";

export default function MembershipDashboardPage() {
  const { applications, isLoading, refetch } = useUserMembershipApplications();
  const [filter, setFilter] = useState<"all" | "active" | "review">("all");
  const [publicMemberships, setPublicMemberships] = useState<Membership[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(false);

  useEffect(() => {
    if (!isLoading && applications.length === 0) {
      setLoadingTiers(true);
      fetchPublicMemberships()
        .then((data) => setPublicMemberships(data))
        .finally(() => setLoadingTiers(false));
    }
  }, [isLoading, applications.length]);

  const filteredApplications = useMemo(() => {
    if (filter === "active") {
      return applications.filter((app) => app.status === "active");
    }
    if (filter === "review") {
      return applications.filter(
        (app) =>
          app.status === "under_review" ||
          app.status === "pending" ||
          app.status === "approved",
      );
    }
    return applications;
  }, [applications, filter]);

  const activeCount = useMemo(
    () => applications.filter((a) => a.status === "active").length,
    [applications],
  );

  const reviewCount = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.status === "under_review" ||
          a.status === "pending" ||
          a.status === "approved",
      ).length,
    [applications],
  );

  return (
    <DashboardLayout title="My Memberships">
      <div className="space-y-8">
        {/* Page Subheader */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0D154B] sm:text-2xl">
              Membership Applications & Status
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Track the progress of your submitted membership applications and
              active professional credentials.
            </p>
          </div>

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

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card border border-base-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Total Applications
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#0D154B]">
                  {isLoading ? "-" : applications.length}
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
                  In Review / Approved
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#D97706]">
                  {isLoading ? "-" : reviewCount}
                </h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/15 text-warning">
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          /* Empty State: User hasn't applied yet */
          <div className="space-y-8">
            <div className="card border border-base-200/80 bg-white p-8 text-center shadow-xs sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C99E4A]/15 text-[#C99E4A]">
                <HugeiconsIcon
                  icon={ShieldCheckIcon}
                  size={32}
                  color="currentColor"
                />
              </div>
              <h3 className=" text-xl font-bold text-[#0D154B] sm:text-2xl">
                No Membership Applications Yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
                You haven&apos;t applied for any membership grade yet. Complete
                an eligibility assessment to join the Association of Chartered
                Loss Prevention Specialists.
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

            {/* Public Membership Categories Available */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#0D154B]">
                  Available Membership Categories
                </h3>
                <p className="text-sm text-base-content/70">
                  Select a grade suited to your career stage and experience to
                  apply:
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
          /* Applications List */
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
                All Applications ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("active")}
                className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                  filter === "active"
                    ? "btn-primary text-white"
                    : "btn-ghost text-base-content/70 hover:text-base-content"
                }`}
              >
                Active Credentials ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("review")}
                className={`btn btn-sm rounded-xl normal-case text-xs font-semibold ${
                  filter === "review"
                    ? "btn-primary text-white"
                    : "btn-ghost text-base-content/70 hover:text-base-content"
                }`}
              >
                Under Review / Approved ({reviewCount})
              </button>
            </div>

            {/* Application Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredApplications.map((app) => (
                <MembershipApplicationCard key={app.id} application={app} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
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

  const statusConfig = useMemo(() => {
    switch (application.status) {
      case "active":
        return {
          label: "Active Member",
          badgeClass: "badge-success text-white",
          dotColor: "bg-white",
        };
      case "approved":
        return {
          label: "Approved (Payment Pending)",
          badgeClass: "badge-info text-white",
          dotColor: "bg-white",
        };
      case "rejected":
        return {
          label: "Application Declined",
          badgeClass: "badge-error text-white",
          dotColor: "bg-white",
        };
      case "under_review":
      case "pending":
      default:
        return {
          label: "Under Review",
          badgeClass: "badge-warning text-amber-950",
          dotColor: "bg-amber-900",
        };
    }
  }, [application.status]);

  const priceText = useMemo(() => {
    if (application.price != null && !isNaN(Number(application.price))) {
      const cur = application.currency === "USD" ? "$" : "CA$";
      return `${cur}${Number(application.price).toLocaleString()}`;
    }
    return "CA$595";
  }, [application.price, application.currency]);

  return (
    <div className="card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-base-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C99E4A]/60 hover:shadow-md">
      <div>
        {/* Top: Badge and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#C99E4A] bg-white p-1.5 shadow-xs">
            <Image
              src={badgeSrc}
              alt={application.name}
              fill
              sizes="56px"
              unoptimized={isRemote}
              className="object-contain p-1"
            />
          </div>

          <span
            className={`badge ${statusConfig.badgeClass} gap-1.5 px-3 py-2 text-xs font-semibold`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`}
            />
            {statusConfig.label}
          </span>
        </div>

        {/* Title and ID */}
        <div className="">
          <h4 className="text-lg font-bold leading-snug text-[#0D154B]">
            {application.name}
          </h4>
          <p className="mt-1 font-mono text-xs text-base-content/60">
            Ref:{" "}
            {application.memberNumber ||
              application.id.slice(0, 10).toUpperCase()}
          </p>
        </div>

        {/* Details List */}
        <div className=" space-y-2 rounded-xl bg-base-100/60 p-3 text-xs">
          <div className="flex items-center justify-between text-base-content/70">
            <span>Applied Date:</span>
            <span className="font-semibold text-base-content">
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
          <div className="flex items-center justify-between text-base-content/70">
            <span>Validity / Term:</span>
            <span className="font-semibold text-base-content">
              {application.duration || "1 Year"}
            </span>
          </div>
          <div className="flex items-center justify-between text-base-content/70">
            <span>Annual Fee:</span>
            <span className="font-bold text-[#0D154B]">{priceText}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex flex-col gap-2 pt-2">
        <Link
          href={`/dashboard/membership/${application.id}`}
          className="btn btn-outline btn-sm w-full gap-2 rounded-xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
        >
          <span>View Application Details</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={14}
            color="currentColor"
          />
        </Link>
      </div>
    </div>
  );
}
