"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Award01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Copy01Icon,
  CreditCardIcon,
  Download01Icon,
  HelpCircleIcon,
  Invoice01Icon,
  SecurityCheckIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Assets } from "@/lib/assets";
import { RootState } from "@/lib/store/store";
import { useUserMembershipApplicationDetail } from "../domain/data/hooks/user_membership_hooks";
import { StripePaymentModal } from "@/features/orders";

export default function MembershipDetailPage({ id }: { id: string }) {
  const user = useSelector((state: RootState) => state.user);
  const { application, isLoading, refetch } =
    useUserMembershipApplicationDetail(id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const statusConfig = useMemo(() => {
    if (!application) return null;
    switch (application.status) {
      case "active":
        return {
          stepIndex: 3,
          label: "Active Member",
          badgeClass: "badge-success text-white",
          dotColor: "bg-white",
          title: "Membership Active",
          description:
            "Your membership is active and in good standing with the Association of Chartered Loss Prevention Specialists.",
        };
      case "approved":
        return {
          stepIndex: 2,
          label: "Approved (Payment Pending)",
          badgeClass: "badge-info text-white",
          dotColor: "bg-white",
          title: "Application Approved",
          description:
            "Congratulations! Your application has been approved by the admissions committee. Please complete the enrollment payment to activate your credentials.",
        };
      case "rejected":
        return {
          stepIndex: 1,
          label: "Declined",
          badgeClass: "badge-error text-white",
          dotColor: "bg-white",
          title: "Application Not Approved",
          description:
            "Your application was not approved at this time. Please reach out to support for feedback on prerequisites or documentation.",
        };
      case "under_review":
      case "pending":
      default:
        return {
          stepIndex: 1,
          label: "Under Review",
          badgeClass: "badge-warning text-amber-950",
          dotColor: "bg-amber-900",
          title: "Application Under Review",
          description:
            "Your application has been received and is currently under review by our credentialing committee. Standard review turnaround is 2–3 business days.",
        };
    }
  }, [application]);

  const priceText = useMemo(() => {
    if (application?.price != null && !isNaN(Number(application.price))) {
      const cur = application.currency === "USD" ? "$" : "CA$";
      return `${cur}${Number(application.price).toLocaleString()}`;
    }
    return "CA$595";
  }, [application?.price, application?.currency]);

  const copyMemberId = () => {
    const textToCopy =
      application?.memberNumber ||
      `CHLPS-APP-${application?.id.slice(0, 8).toUpperCase()}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Member ID copied to clipboard!");
  };

  const badgeSrc = application?.badge || Assets.icons.logo;
  const isRemote =
    badgeSrc.startsWith("http://") || badgeSrc.startsWith("https://");

  const membershipsForModal = useMemo(
    () =>
      application
        ? [
            {
              id: application.membershipId || application.id,
              price: application.price ?? 595,
              applicationId: application.applicationId || application.id,
            },
          ]
        : [],
    [application],
  );

  return (
    <DashboardLayout title="Membership Details">
      <div className="space-y-6">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/membership"
            className="btn btn-ghost btn-sm gap-2 rounded-xl text-xs font-semibold text-base-content/80 normal-case hover:text-base-content"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            <span>Back to My Memberships</span>
          </Link>

          {application && (
            <span
              className={`badge ${statusConfig?.badgeClass} gap-1.5 px-3 py-2 text-xs font-semibold`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusConfig?.dotColor}`}
              />
              {statusConfig?.label}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="skeleton h-36 rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="skeleton h-80 rounded-2xl lg:col-span-7" />
              <div className="skeleton h-80 rounded-2xl lg:col-span-5" />
            </div>
          </div>
        ) : !application ? (
          /* Not Found */
          <div className="card border border-base-200/80 bg-white p-8 text-center shadow-xs sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/60">
              <HugeiconsIcon icon={ShieldCheckIcon} size={32} />
            </div>
            <h3 className=" text-xl font-bold text-[#0D154B]">
              Application Not Found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              The requested membership application could not be found or has
              been archived.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/dashboard/membership"
                className="btn btn-primary btn-sm rounded-xl normal-case text-xs font-semibold"
              >
                Return to My Memberships
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Banner Card */}
            <div className="card overflow-hidden border border-base-200/80 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <HugeiconsIcon
                      icon={
                        application.status === "active"
                          ? Award01Icon
                          : application.status === "approved"
                            ? SecurityCheckIcon
                            : Clock01Icon
                      }
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0D154B] sm:text-xl">
                      {statusConfig?.title}
                    </h3>
                    <p className="mt-1 text-sm text-base-content/70">
                      {statusConfig?.description}
                    </p>
                  </div>
                </div>

                {application.status === "approved" && (
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="btn btn-primary btn-md gap-2 rounded-xl text-sm font-semibold normal-case shadow-sm"
                    >
                      <HugeiconsIcon icon={CreditCardIcon} size={18} />
                      <span>Complete Enrollment ({priceText})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Application Progress Steps */}
              <div className="mt-8 border-t border-base-200/80 pt-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Application Lifecycle
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-xs font-semibold text-success">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      className="shrink-0"
                    />
                    <span>1. Application Submitted</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                      (statusConfig?.stepIndex ?? 0) >= 1
                        ? "border border-success/30 bg-success/10 text-success"
                        : "border border-base-200 bg-base-100 text-base-content/60"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={
                        (statusConfig?.stepIndex ?? 0) >= 2
                          ? CheckmarkCircle02Icon
                          : Clock01Icon
                      }
                      size={16}
                      className="shrink-0"
                    />
                    <span>2. Committee Review</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                      (statusConfig?.stepIndex ?? 0) >= 2
                        ? "border border-success/30 bg-success/10 text-success"
                        : "border border-base-200 bg-base-100 text-base-content/60"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={
                        (statusConfig?.stepIndex ?? 0) >= 3
                          ? CheckmarkCircle02Icon
                          : CreditCardIcon
                      }
                      size={16}
                      className="shrink-0"
                    />
                    <span>3. Payment & Enrollment</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                      (statusConfig?.stepIndex ?? 0) >= 3
                        ? "border border-success/30 bg-success/10 text-success"
                        : "border border-base-200 bg-base-100 text-base-content/60"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={
                        (statusConfig?.stepIndex ?? 0) >= 3
                          ? CheckmarkCircle02Icon
                          : Award01Icon
                      }
                      size={16}
                      className="shrink-0"
                    />
                    <span>4. Active Credential</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content 2-Column Grid */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              {/* Left Column: Grade Info & Questionnaire Answers */}
              <div className="space-y-6 lg:col-span-7">
                {/* Grade Overview Card */}
                <div className="card border border-base-200/80 bg-white p-6 shadow-xs sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#C99E4A] bg-white p-2 shadow-xs">
                      <Image
                        src={badgeSrc}
                        alt={application.name}
                        fill
                        sizes="64px"
                        unoptimized={isRemote}
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2B3582]">
                        Membership Category
                      </span>
                      <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0D154B] sm:text-2xl">
                        {application.name}
                      </h2>
                    </div>
                  </div>

                  {application.description && (
                    <p className=" text-sm leading-relaxed text-base-content/80">
                      {application.description}
                    </p>
                  )}

                  {/* Fact Sheet */}
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-base-200/80 pt-6 sm:grid-cols-4">
                    <div>
                      <span className="block text-xs font-medium uppercase text-base-content/60">
                        Application Ref
                      </span>
                      <span className="mt-1 block font-mono text-xs font-bold text-base-content">
                        {application.memberNumber ||
                          application.id.slice(0, 10).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs font-medium uppercase text-base-content/60">
                        Submission Date
                      </span>
                      <span className="mt-1 block text-xs font-bold text-base-content">
                        {application.appliedDate
                          ? new Date(
                              application.appliedDate,
                            ).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Pending"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs font-medium uppercase text-base-content/60">
                        Validity Term
                      </span>
                      <span className="mt-1 block text-xs font-bold text-base-content">
                        {application.duration || "1 Year"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs font-medium uppercase text-base-content/60">
                        Annual Fee
                      </span>
                      <span className="mt-1 block text-xs font-bold text-[#0D154B]">
                        {priceText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submitted Eligibility Questionnaire */}
                {application.answers && application.answers.length > 0 && (
                  <div className="card border border-base-200/80 bg-white p-6 shadow-xs sm:p-8">
                    <div className="flex items-center justify-between border-b border-base-200/80 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-[#0D154B]">
                          Eligibility Screening Responses
                        </h4>
                        <p className="text-xs text-base-content/70">
                          Answers provided during the qualification assessment
                        </p>
                      </div>
                      <span className="badge badge-ghost text-xs font-semibold">
                        {application.answers.length} Questions Answered
                      </span>
                    </div>

                    <div className=" divide-y divide-base-200/60">
                      {application.answers.map((item, idx) => (
                        <div
                          key={item.questionId || idx}
                          className="flex items-center justify-between gap-4 py-3.5"
                        >
                          <span className="text-sm font-medium text-base-content/85">
                            {item.questionText ||
                              `Eligibility Assessment Question #${idx + 1}`}
                          </span>
                          <span
                            className={`badge badge-sm px-2.5 py-1 text-xs font-bold ${
                              item.answer
                                ? "badge-success text-white"
                                : "badge-ghost text-base-content/60"
                            }`}
                          >
                            {item.answer ? "Yes (Confirmed)" : "No"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privileges & Benefits */}
                {application.benefits && application.benefits.length > 0 && (
                  <div className="card border border-base-200/80 bg-white p-6 shadow-xs sm:p-8">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C99E4A]/15 text-[#C99E4A]">
                        <HugeiconsIcon icon={SparklesIcon} size={16} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#0D154B]">
                          Included Grade Privileges
                        </h4>
                        <p className="text-xs text-base-content/70">
                          Chartered benefits associated with this credential
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {application.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl border border-base-200/80 bg-base-100/40 p-3 text-xs leading-relaxed text-base-content/80"
                        >
                          <span className="mt-0.5 text-success">✓</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Digital Card, Actions, Support */}
              <div className="space-y-6 lg:col-span-5">
                {/* Digital Card (for active members) */}
                {application.status === "active" ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[#C99E4A]/50 bg-gradient-to-br from-[#0B1542] via-[#101D63] to-[#1E1758] p-6 text-white shadow-xl sm:p-7">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-[#C99E4A]/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-[#10B981]/15 blur-3xl" />

                    <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
                          <Image
                            src={Assets.icons.logo}
                            alt="ChLPS Canada"
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold tracking-widest text-[#C99E4A] uppercase">
                            Chartered Body
                          </p>
                          <h4 className="text-xs font-bold text-white">
                            Association of Chartered Loss Prevention
                          </h4>
                        </div>
                      </div>

                      <span className="badge badge-success badge-sm gap-1 text-white">
                        <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                        Active
                      </span>
                    </div>

                    <div className="relative z-10 my-6 space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                        Registered Member
                      </p>
                      <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {user.fullName ||
                          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                          "Chartered Member"}
                      </h3>
                      <p className="text-sm font-semibold text-[#E5C77A]">
                        {application.name}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                      <div>
                        <span className="block text-[10px] font-medium uppercase tracking-wider text-white/50">
                          Member ID
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white">
                            {application.memberNumber ||
                              `CHLPS-${application.id.slice(0, 8).toUpperCase()}`}
                          </span>
                          <button
                            type="button"
                            onClick={copyMemberId}
                            className="btn btn-ghost btn-xs text-white/70 hover:text-white"
                            title="Copy Member ID"
                          >
                            <HugeiconsIcon icon={Copy01Icon} size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] font-medium uppercase tracking-wider text-white/50">
                          Valid Through
                        </span>
                        <span className="mt-1 block font-mono text-xs font-bold text-white">
                          {application.expiryDate
                            ? new Date(
                                application.expiryDate,
                              ).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Annual Validity"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Action / Status Box for Pending or Approved */
                  <div className="card border border-base-200/80 bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-3 border-b border-base-200/80 pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <HugeiconsIcon icon={SecurityCheckIcon} size={20} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#0D154B]">
                          Application Summary
                        </h4>
                        <p className="text-xs text-base-content/60">
                          Status and next steps
                        </p>
                      </div>
                    </div>

                    <div className=" space-y-3 text-xs">
                      <div className="flex justify-between text-base-content/70">
                        <span>Current Stage:</span>
                        <span className="font-bold text-[#0D154B]">
                          {statusConfig?.label}
                        </span>
                      </div>
                      <div className="flex justify-between text-base-content/70">
                        <span>Enrollment Fee:</span>
                        <span className="font-bold text-[#0D154B]">
                          {priceText}
                        </span>
                      </div>
                    </div>

                    {application.status === "approved" ? (
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={() => setIsPaymentModalOpen(true)}
                          className="btn btn-primary btn-md w-full gap-2 rounded-xl text-sm font-semibold normal-case shadow-sm"
                        >
                          <HugeiconsIcon icon={CreditCardIcon} size={18} />
                          <span>Pay & Activate Membership</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 border border-amber-200/70">
                        <p className="font-semibold">Review in Progress</p>
                        <p className="mt-1">
                          Our admissions team will notify you via email when
                          your verification is complete. Once approved, the
                          payment action will become active here.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Helpful Quick Links Card */}
                <div className="card border border-base-200/80 bg-white p-6 shadow-xs">
                  <h4 className="text-sm font-bold text-[#0D154B]">
                    Need Assistance?
                  </h4>
                  <p className="mt-1 text-xs text-base-content/70">
                    If you have questions about your application, document
                    verification, or membership fees:
                  </p>

                  <div className=" flex flex-col gap-2">
                    <Link
                      href="/dashboard/support"
                      className="btn btn-outline btn-sm justify-start gap-2 rounded-xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
                    >
                      <HugeiconsIcon icon={HelpCircleIcon} size={16} />
                      <span>Contact Admissions Support</span>
                    </Link>

                    <Link
                      href="/dashboard/purchase-history"
                      className="btn btn-outline btn-sm justify-start gap-2 rounded-xl border-base-300 normal-case text-xs font-semibold text-[#0D154B] hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
                    >
                      <HugeiconsIcon icon={Invoice01Icon} size={16} />
                      <span>View Orders & Transactions</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stripe Payment Modal for Approved Applications */}
      {isPaymentModalOpen && application && (
        <StripePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Join ${application.name}`}
          memberships={membershipsForModal}
          estimatedAmount={application.price ?? 595}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            toast.success("Payment completed successfully! Refreshing status...");
            refetch();
          }}
        />
      )}
    </DashboardLayout>
  );
}
