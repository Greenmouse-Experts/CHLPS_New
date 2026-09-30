"use client";

import { use } from "react";
import simpleApiClient from "@/lib/network/simpleApi";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  XCircle,
  Calendar,
  Hash,
  FileText,
  User,
} from "lucide-react";
import PageLoader from "@/components/PageLoader";
import ImagelessHeader from "@/components/ImagelessHeader";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";

export default function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const query = useQuery({
    queryKey: ["certificate", id],
    queryFn: async () => {
      const resp = await simpleApiClient.get(`certificates/verify/${id}`);
      return resp.data?.data ?? resp.data;
    },
    enabled: Boolean(id),
  });

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <ImagelessHeader
        badge="Certificate Verification"
        title="Verify Certificate Authenticity"
        description="Use this page to confirm the authenticity of a Chartered Loss Prevention Specialists Canada (CHLPS) certificate. Each certificate is uniquely issued and traceable."
      />
      <main className="flex-1">
        <PageLoader query={query}>
          {(data: any) => {
            const student = data?.student || {};
            const isRevoked = data?.isRevoked;
            const issuedDate = data?.issuedAt
              ? new Date(data.issuedAt).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—";

            return (
              <section className="px-6 py-16 container mx-auto">
                <div>
                  {/* Status banner */}
                  <div
                    className={`mb-10 flex items-center gap-4 rounded-2xl px-6 py-5 ${
                      isRevoked
                        ? "bg-error/10 text-error"
                        : "bg-emerald-500/10 text-emerald-800"
                    }`}
                  >
                    {isRevoked ? (
                      <XCircle className="h-8 w-8 shrink-0 text-error" />
                    ) : (
                      <BadgeCheck className="h-8 w-8 shrink-0 text-emerald-600" />
                    )}
                    <div>
                      <p className="text-lg font-bold">
                        {isRevoked
                          ? "Certificate Revoked"
                          : "Certificate Verified"}
                      </p>
                      <p className="opacity-80 text-sm">
                        {isRevoked
                          ? "This certificate has been revoked and is no longer valid."
                          : "This is an authentic certificate issued by Chartered Loss Prevention Specialists Canada (CHLPS)."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Certificate details */}
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                      <h2 className="mb-6 text-xl font-bold text-base-content">
                        Certificate Details
                      </h2>
                      <ul className="space-y-5">
                        <li className="flex items-start gap-3">
                          <Hash className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div>
                            <p className="font-medium tracking-widest text-base-content/50 uppercase text-xs">
                              Certificate Number
                            </p>
                            <p className="mt-0.5 font-semibold text-base-content">
                              {data?.certificateNumber || id}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div>
                            <p className="font-medium tracking-widest text-base-content/50 uppercase text-xs">
                              Issue Date
                            </p>
                            <p className="mt-0.5 font-semibold text-base-content">
                              {issuedDate}
                            </p>
                          </div>
                        </li>
                        {data?.course && (
                          <li className="flex items-start gap-3">
                            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <div>
                              <p className="font-medium tracking-widest text-base-content/50 uppercase text-xs">
                                Course / Program
                              </p>
                              <p className="mt-0.5 font-semibold text-base-content">
                                {data.course.title}
                              </p>
                            </div>
                          </li>
                        )}
                      </ul>

                      {data?.certificateUrl && (
                        <a
                          href={data.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary mt-8 w-full rounded-xl gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          View Certificate PDF
                        </a>
                      )}
                    </div>

                    {/* Student info */}
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                      <h2 className="mb-6 text-xl font-bold text-base-content">
                        Certificate Holder
                      </h2>
                      <div className="flex items-center gap-4">
                        {student.picture ? (
                          <img
                            loading="lazy"
                            src={student.picture}
                            alt={`${student.firstName || ""} ${student.lastName || ""}`}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-content">
                            {student.firstName?.[0] || "C"}
                          </div>
                        )}
                        <div>
                          <p className="text-xl font-bold text-base-content capitalize">
                            {student.firstName?.toLowerCase() || ""}{" "}
                            {student.lastName?.toLowerCase() || ""}
                          </p>
                          <p className="text-base-content/60 text-sm">
                            {student.email || ""}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-start gap-3">
                        <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium tracking-widest text-base-content/50 uppercase text-xs">
                            Designation / Role
                          </p>
                          <p className="mt-0.5 font-semibold capitalize text-base-content">
                            {student.role || "Member"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 rounded-xl bg-accent/10 px-5 py-4">
                        <p className="text-base-content/70 text-sm leading-relaxed">
                          This certificate was issued by{" "}
                          <span className="font-semibold text-accent">
                            Chartered Loss Prevention Specialists Canada
                            (CHLPS)&trade;
                          </span>{" "}
                          and is verifiable through our official verification
                          portal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }}
        </PageLoader>
      </main>
      <Footer />
    </div>
  );
}
