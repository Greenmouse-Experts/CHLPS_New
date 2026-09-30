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
  Cancel01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Copy01Icon,
  CreditCardIcon,
  Download01Icon,
  HelpCircleIcon,
  Invoice01Icon,
  Loading03Icon,
  SecurityCheckIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Assets } from "@/lib/assets";
import { RootState } from "@/lib/store/store";
import simpleApiClient from "@/lib/network/simpleApi";
import {
  useUserMembershipApplicationDetail,
  useMembershipCertificate,
} from "../domain/data/hooks/user_membership_hooks";
import { PaypalPaymentModal } from "@/features/orders";

export default function MembershipDetailPage({ id }: { id: string }) {
  const user = useSelector((state: RootState) => state.user);
  const { application, isLoading, refetch } =
    useUserMembershipApplicationDetail(id);

  const targetMembershipId = application?.membershipId || application?.id || id;
  const {
    certificateUrl: fetchedCertUrl,
    isLoading: isCertLoading,
    refetch: refetchCert,
  } = useMembershipCertificate(targetMembershipId, user?.userId);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [generatedCertUrl, setGeneratedCertUrl] = useState<string | null>(null);

  const effectiveCertificateUrl =
    generatedCertUrl || fetchedCertUrl || application?.certificateUrl;

  const statusConfig = useMemo(() => {
    if (!application) return null;
    switch (application.status) {
      case "active":
        return {
          stepIndex: 3,
          label: "Active",
          badgeClass: "badge-success text-white",
          dotColor: "bg-white",
          title: "Membership Active",
          description:
            "Your membership is active and in good standing with the Association of Chartered Loss Prevention Specialists.",
        };
      case "approved":
        return {
          stepIndex: 2,
          label: "Approved",
          badgeClass: "bg-emerald-600 text-white border-emerald-600",
          dotColor: "bg-white",
          title: "Application Approved",
          description:
            "Congratulations! Your application has been approved by the admissions committee. You can now generate and download your official certificate.",
        };
      case "expired":
        return {
          stepIndex: 3,
          label: "Expired",
          badgeClass: "badge-ghost text-base-content/90 border-base-300",
          dotColor: "bg-base-content/50",
          title: "Membership Expired",
          description:
            "Your membership term has concluded. Renew today to maintain continuous chartered privileges and credentials.",
        };
      case "cancelled":
        return {
          stepIndex: 1,
          label: "Cancelled",
          badgeClass: "badge-neutral text-white",
          dotColor: "bg-white",
          title: "Membership Cancelled",
          description:
            "This membership application or subscription has been cancelled.",
        };
      case "rejected":
        return {
          stepIndex: 1,
          label: "Rejected",
          badgeClass: "badge-error text-white",
          dotColor: "bg-white",
          title: "Application Rejected",
          description:
            application.rejectReason ||
            "Your application was not approved at this time. Please reach out to support for feedback on prerequisites or documentation.",
        };
      case "pending_approval":
      case "under_review":
      case "pending":
      default:
        return {
          stepIndex: 1,
          label: "Pending Approval",
          badgeClass: "badge-warning text-amber-950",
          dotColor: "bg-amber-900",
          title: "Application Pending Approval",
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

  const handleGenerateCertificate = async () => {
    if (isGeneratingCert) return;
    setIsGeneratingCert(true);
    try {
      const payload: Record<string, any> = {
        membershipId: application?.membershipId || application?.id,
        applicationId: application?.applicationId || application?.id,
      };

      const res: any = await simpleApiClient.post(
        "certificates/generate",
        payload,
      );
      const data = res?.data?.data ?? res?.data ?? res;

      if (data?.certificateUrl) {
        setGeneratedCertUrl(data.certificateUrl);
        toast.success("Certificate generated successfully!");
        setIsGeneratingCert(false);
        refetch();
        refetchCert();
        return;
      }

      if (data?.jobId) {
        const jobId = data.jobId;
        const poll = async (id: string, attempts = 0) => {
          if (attempts > 12) {
            setIsGeneratingCert(false);
            toast.error(
              "Certificate generation timed out. Please check back shortly.",
            );
            return;
          }
          try {
            const statusRes: any = await simpleApiClient.get(
              `certificates/generate/${id}/status`,
            );
            const statusData =
              statusRes?.data?.data ?? statusRes?.data ?? statusRes;

            if (
              statusData?.status === "completed" &&
              (statusData?.certificate?.certificateUrl ||
                statusData?.certificateUrl)
            ) {
              const url =
                statusData?.certificate?.certificateUrl ||
                statusData?.certificateUrl;
              setGeneratedCertUrl(url);
              setIsGeneratingCert(false);
              toast.success("Certificate generated successfully!");
              refetch();
              refetchCert();
              return;
            }

            if (statusData?.status === "failed") {
              setIsGeneratingCert(false);
              toast.error(
                statusData?.error || "Certificate generation failed.",
              );
              return;
            }

            setTimeout(() => poll(id, attempts + 1), 3000);
          } catch {
            setIsGeneratingCert(false);
            toast.error("Could not verify certificate status.");
          }
        };
        poll(jobId);
        return;
      }

      toast.success(
        res?.data?.message || "Certificate generated successfully!",
      );
      setIsGeneratingCert(false);
      refetch();
      refetchCert();
    } catch (err: any) {
      setIsGeneratingCert(false);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to generate certificate.",
      );
    }
  };

  return (
    <DashboardLayout title="Application Details">
      <div className="space-y-6">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/my-applications"
            className="btn btn-ghost btn-sm gap-2 rounded-xl text-xs font-semibold text-base-content/80 normal-case hover:text-base-content"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            <span>Back to Applications</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/membership"
              className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/90 hover:text-base-content"
            >
              My Memberships
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="card border border-base-200/80 bg-white p-12 text-center shadow-xs">
            <span className="loading loading-spinner loading-lg mx-auto text-primary" />
            <p className="mt-4 text-sm font-medium text-base-content/60">
              Loading membership application details...
            </p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!isLoading && !application && (
          <div className="card border border-base-200/80 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200/60 text-base-content/40">
              <HugeiconsIcon icon={ShieldCheckIcon} size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0D154B]">
              Application Not Found
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-base-content/60">
              The membership application record could not be loaded. Please
              verify the link or return to your applications dashboard.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/my-applications"
                className="btn btn-primary btn-sm rounded-xl normal-case"
              >
                Back to My Applications
              </Link>
            </div>
          </div>
        )}

        {/* Application Detail Content */}
        {!isLoading && application && (
          <div className="space-y-6">
            {/* Top Status Banner Card */}
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
                            : application.status === "rejected"
                              ? Cancel01Icon
                              : Clock01Icon
                      }
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0D154B] sm:text-xl">
                      {statusConfig?.title}
                    </h3>
                    <p className="mt-1 text-sm text-base-content/90">
                      {statusConfig?.description}
                    </p>
                    {application.status === "rejected" &&
                      application.rejectReason && (
                        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800">
                          <span className="font-bold">
                            Reason for decision:{" "}
                          </span>
                          <span>{application.rejectReason}</span>
                        </div>
                      )}
                    {application.reviewedAt && (
                      <p className="mt-2 text-xs text-base-content/60">
                        Reviewed on:{" "}
                        <span className="font-semibold text-base-content/80">
                          {new Date(application.reviewedAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {application.status === "approved" && (
                  <div className="flex shrink-0 items-center gap-3">
                    {effectiveCertificateUrl ? (
                      <a
                        href={effectiveCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-md gap-2 rounded-xl text-sm font-semibold normal-case shadow-sm"
                      >
                        <HugeiconsIcon icon={Download01Icon} size={18} />
                        <span>Download Certificate</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGenerateCertificate}
                        disabled={isGeneratingCert}
                        className="btn btn-primary btn-md gap-2 rounded-xl text-sm font-semibold normal-case shadow-sm"
                      >
                        {isGeneratingCert ? (
                          <HugeiconsIcon
                            icon={Loading03Icon}
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <HugeiconsIcon icon={Award01Icon} size={18} />
                        )}
                        <span>
                          {isGeneratingCert
                            ? "Generating Certificate..."
                            : "Generate Certificate"}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Application Progress Steps */}
              <div className="mt-8 border-t border-base-200/80 pt-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Application Lifecycle
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  {/* Step 1: Submission */}
                  <div className="flex items-center gap-3 rounded-xl border border-base-200/80 bg-base-100/40 p-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white text-xs font-bold">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#0D154B]">
                        1. Submitted
                      </span>
                      <span className="block text-[10px] text-base-content/60">
                        {application.appliedDate
                          ? new Date(
                              application.appliedDate,
                            ).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Completed"}
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Committee Review */}
                  <div
                    className={`flex items-center gap-3 rounded-xl border p-3.5 ${
                      application.status === "pending_approval" ||
                      application.status === "under_review" ||
                      application.status === "pending"
                        ? "border-amber-300 bg-amber-50/70"
                        : application.status === "approved" ||
                            application.status === "active"
                          ? "border-emerald-200 bg-emerald-50/50"
                          : application.status === "rejected"
                            ? "border-rose-200 bg-rose-50/50"
                            : "border-base-200/80 bg-base-100/40"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        application.status === "approved" ||
                        application.status === "active"
                          ? "bg-emerald-500 text-white"
                          : application.status === "rejected"
                            ? "bg-rose-500 text-white"
                            : "bg-amber-500 text-white"
                      }`}
                    >
                      {application.status === "approved" ||
                      application.status === "active" ? (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                      ) : application.status === "rejected" ? (
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      ) : (
                        <HugeiconsIcon icon={Clock01Icon} size={16} />
                      )}
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#0D154B]">
                        2. Review
                      </span>
                      <span className="block text-[10px] text-base-content/60">
                        {application.status === "approved"
                          ? "Approved"
                          : application.status === "rejected"
                            ? "Not Approved"
                            : "In Review"}
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Certificate Issuance */}
                  <div
                    className={`flex items-center gap-3 rounded-xl border p-3.5 ${
                      application.status === "approved" ||
                      application.status === "active"
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-base-200/80 bg-base-100/40 opacity-70"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        application.status === "active" ||
                        application.status === "approved"
                          ? "bg-emerald-500 text-white"
                          : "bg-base-300 text-base-content/60"
                      }`}
                    >
                      <HugeiconsIcon icon={Award01Icon} size={16} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#0D154B]">
                        3. Certificate
                      </span>
                      <span className="block text-[10px] text-base-content/60">
                        {application.status === "active" ||
                        application.status === "approved"
                          ? "Ready"
                          : "Pending Approval"}
                      </span>
                    </div>
                  </div>

                  {/* Step 4: Active Credential */}
                  <div
                    className={`flex items-center gap-3 rounded-xl border p-3.5 ${
                      application.status === "active"
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-base-200/80 bg-base-100/40 opacity-70"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        application.status === "active"
                          ? "bg-emerald-500 text-white"
                          : "bg-base-300 text-base-content/60"
                      }`}
                    >
                      <HugeiconsIcon icon={ShieldCheckIcon} size={16} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#0D154B]">
                        4. Chartered Status
                      </span>
                      <span className="block text-[10px] text-base-content/60">
                        {application.status === "active"
                          ? "In Good Standing"
                          : "Upcoming"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid: 2 Columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Membership Grade Info & Question Responses */}
              <div className="space-y-6 lg:col-span-7">
                {/* Grade Profile Card */}
                <div className="card border border-base-200/80 bg-white p-6 shadow-xs sm:p-8">
                  <div className="flex items-start gap-4 border-b border-base-200/80 pb-6">
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-[#C99E4A] bg-[#0B0E33] p-2 shadow-sm">
                      <Image
                        src={badgeSrc}
                        alt={`${application.name} badge`}
                        fill
                        unoptimized={isRemote}
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <span
                        className={`badge ${statusConfig?.badgeClass} gap-1.5 px-2.5 py-1 text-xs font-semibold`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusConfig?.dotColor}`}
                        />
                        {statusConfig?.label}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-[#0D154B] sm:text-2xl">
                        {application.name}
                      </h3>
                      {application.description && (
                        <p className="mt-1 text-xs leading-relaxed text-base-content/90 line-clamp-3">
                          {application.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div>
                      <span className="block text-xs font-medium uppercase text-base-content/60">
                        Application Ref
                      </span>
                      <span className="mt-1 block font-mono text-xs font-bold text-base-content">
                        {application.memberNumber ||
                          application.id.slice(0, 8).toUpperCase()}
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
                        <p className="text-xs text-base-content/90">
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
                        <p className="text-xs text-base-content/90">
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

                    {effectiveCertificateUrl && (
                      <div className="relative z-10 mt-5 border-t border-white/10 pt-4">
                        <a
                          href={effectiveCertificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm w-full gap-2 rounded-xl text-xs font-bold normal-case shadow-sm"
                        >
                          <HugeiconsIcon icon={Download01Icon} size={15} />
                          <span>Download Official Certificate</span>
                        </a>
                      </div>
                    )}
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
                      <div className="flex justify-between text-base-content/90">
                        <span>Current Stage:</span>
                        <span className="font-bold text-[#0D154B]">
                          {statusConfig?.label}
                        </span>
                      </div>
                      <div className="flex justify-between text-base-content/90">
                        <span>Enrollment Fee:</span>
                        <span className="font-bold text-[#0D154B]">
                          {priceText}
                        </span>
                      </div>
                    </div>

                    {application.status === "approved" ? (
                      <div className="mt-6 space-y-3">
                        {effectiveCertificateUrl ? (
                          <a
                            href={effectiveCertificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-md w-full gap-2 rounded-xl text-sm font-semibold normal-case shadow-sm"
                          >
                            <HugeiconsIcon icon={Download01Icon} size={18} />
                            <span>Download Certificate</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={handleGenerateCertificate}
                            disabled={isGeneratingCert}
                            className="btn btn-primary btn-md w-full gap-2 rounded-xl text-sm font-semibold normal-case shadow-sm"
                          >
                            {isGeneratingCert ? (
                              <HugeiconsIcon
                                icon={Loading03Icon}
                                size={18}
                                className="animate-spin"
                              />
                            ) : (
                              <HugeiconsIcon icon={Award01Icon} size={18} />
                            )}
                            <span>
                              {isGeneratingCert
                                ? "Generating Certificate..."
                                : "Generate Certificate"}
                            </span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-6 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 border border-amber-200/70">
                        <p className="font-semibold">Review in Progress</p>
                        <p className="mt-1">
                          Our admissions team will notify you via email when
                          your verification is complete. Once approved, you will
                          be able to generate your membership certificate here.
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
                  <p className="mt-1 text-xs text-base-content/90">
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

      {/* PayPal Payment Modal for Approved Applications */}
      {isPaymentModalOpen && application && (
        <PaypalPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Join ${application.name}`}
          memberships={membershipsForModal}
          estimatedAmount={application.price ?? 595}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            toast.success(
              "Payment completed successfully! Refreshing status...",
            );
            refetch();
            refetchCert();
          }}
        />
      )}
    </DashboardLayout>
  );
}
