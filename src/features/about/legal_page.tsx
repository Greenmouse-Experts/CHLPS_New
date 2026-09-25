"use client";

import { useState } from "react";
import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import Footer from "@/features/components/footer";
import HeaderText from "@/components/HeaderText";
import PageContainer from "@/features/components/page_container";
import { Reveal } from "@/features/components/reveal";
import LegalCertificateCard from "@/features/about/components/legal_certificate_card";
import {
  LEGAL_CERTIFICATES,
  type LegalCertificateItem,
} from "@/features/about/legal_data";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShieldCheckIcon,
  CheckmarkBadge01Icon,
  Building03Icon,
  Certificate01Icon,
  Cancel01Icon,
  Download01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

export default function LegalPage() {
  const [selectedPreview, setSelectedPreview] =
    useState<LegalCertificateItem | null>(null);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero Section */}
      <AboutHeroSection
        fixedHeight
        padding
        image="/lega/banner.png"
        imageAlt="CHLPS Canada Legal and Accreditation Banner"
        imageClassName="object-cover object-[right_center]"
        badge="Legal & Institutional Standing"
        title="Institutional Standing &"
        accent="Legal Framework"
        body="The Association of Chartered Loss Prevention Specialists of Canada is a federally incorporated not-for-profit body governed by rigorous legal, ethical, and international accreditation standards."
        bodyWidth="32rem"
      >
        <div className="space-y-3">
          <HeaderText
            smallSize
            left="legal &"
            right="accreditations"
            textWhite
            notCenter
          />
          <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Institutional Standing & <br />
            <span className="text-secondary">Legal Framework</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
            The Association of Chartered Loss Prevention Specialists of Canada
            is a federally incorporated professional institute under the Canada
            Not-for-profit Corporations Act. We hold prestigious global
            accreditations ensuring our certifications, training programs, and
            memberships operate with institutional integrity and worldwide
            credibility.
          </p>
        </div>
      </AboutHeroSection>

      {/* Trust & Authority Overview Pillars */}
      <section className="border-b border-[#E2E8F0] bg-white py-12 sm:py-16">
        <PageContainer>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <HeaderText
                left="Our Official"
                right="Recognition"
                smallSize
              />
              <h2 className="mt-2 text-2xl font-bold text-[#0A1542] sm:text-3xl">
                Rigorous Compliance & Global Quality Assurance
              </h2>
              <p className="mt-3 text-sm text-[#475569] sm:text-base">
                CHLPS Canada maintains transparent statutory filings and
                submits to voluntary peer reviews with international
                accreditation bodies, safeguarding the professional reputation
                of our members worldwide.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={80}>
              <div className="flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition-colors hover:border-secondary">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-secondary">
                  <HugeiconsIcon
                    icon={Building03Icon}
                    size={24}
                    color="currentColor"
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#0A1542] sm:text-lg">
                  Federal Incorporation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                  Chartered under the Canada Not-for-profit Corporations Act by
                  Corporations Canada, establishing legal authority and
                  statutory governance.
                </p>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition-colors hover:border-secondary">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-secondary">
                  <HugeiconsIcon
                    icon={Certificate01Icon}
                    size={24}
                    color="currentColor"
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#0A1542] sm:text-lg">
                  Approved CPD Provider
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                  Accredited by the CPD Standards Office, ensuring continuing
                  education and certifications transfer across jurisdictions
                  with formal CPD credits.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition-colors hover:border-secondary">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-secondary">
                  <HugeiconsIcon
                    icon={ShieldCheckIcon}
                    size={24}
                    color="currentColor"
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#0A1542] sm:text-lg">
                  ACTD Accreditation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                  Accredited as a Professional Certification Organization by the
                  American Council of Training and Development under global
                  curriculum standards.
                </p>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition-colors hover:border-secondary">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-secondary">
                  <HugeiconsIcon
                    icon={CheckmarkBadge01Icon}
                    size={24}
                    color="currentColor"
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#0A1542] sm:text-lg">
                  Quality Assurance
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                  Institutional review confirming compliance with higher
                  educational quality, rigorous competency models, and public
                  accountability.
                </p>
              </div>
            </Reveal>
          </div>
        </PageContainer>
      </section>

      {/* Official Certificates Showcase Grid */}
      <section className="bg-cream py-14 sm:py-20">
        <PageContainer>
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <HeaderText left="Official Charters" right="& Accreditations" />
                <p className="mt-2 text-sm text-[#475569] sm:text-base">
                  Click any document to inspect the official incorporation or
                  accreditation certificate.
                </p>
              </div>
              <div className="rounded-full border border-secondary/40 bg-secondary/15 px-4 py-1.5 text-xs font-semibold text-secondary-content">
                4 Active Accreditations & Charters
              </div>
            </div>
          </Reveal>

          {/* Cards Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {LEGAL_CERTIFICATES.map((cert, index) => (
              <Reveal key={cert.id} delay={index * 80}>
                <LegalCertificateCard
                  item={cert}
                  onPreview={(item) => setSelectedPreview(item)}
                />
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Verification Notice Section */}
      <section className="bg-white py-14 sm:py-16">
        <PageContainer>
          <Reveal>
            <div className="rounded-3xl border border-secondary/30 bg-[#0A1542] p-8 text-white sm:p-12 lg:p-14">
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div>
                  <span className="badge badge-outline border-secondary text-secondary font-medium">
                    Credential & Registry Inquiries
                  </span>
                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                    Third-Party & Employer Verification
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
                    Employers, regulatory authorities, academic institutions,
                    and partner associations can verify the legal charter,
                    active standing, or member credential records of the
                    Association of Chartered Loss Prevention Specialists of
                    Canada directly through our compliance office or via the
                    Corporations Canada federal registry.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/80 sm:text-sm">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkBadge01Icon}
                        size={16}
                        color="#CDA54E"
                      />
                      <span>Corporations Canada Reg No: 1352698-4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkBadge01Icon}
                        size={16}
                        color="#CDA54E"
                      />
                      <span>CPD Provider Reference: #788789</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:items-center sm:text-center">
                  <p className="text-xs uppercase tracking-wider text-secondary">
                    Compliance & Secretariat
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Need official confirmation for regulatory or employment
                    purposes?
                  </p>
                  <a
                    href="mailto:info@chlpscanada.ca?subject=Legal%20Standing%20Verification%20Inquiry"
                    className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-xs font-bold text-[#0A1542] transition-colors hover:brightness-105 sm:text-sm"
                  >
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={16}
                      color="currentColor"
                    />
                    <span>Contact Compliance Office</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </PageContainer>
      </section>

      {/* Shared Lightbox / Modal */}
      {selectedPreview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#0A1542] px-6 py-4 text-white">
              <div>
                <h3 className="text-base font-semibold sm:text-lg">
                  {selectedPreview.title}
                </h3>
                <p className="text-xs text-white/80">
                  {selectedPreview.authority}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close document modal"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} color="currentColor" />
              </button>
            </div>

            {/* Viewer */}
            <div className="flex flex-1 items-center justify-center overflow-auto bg-[#F8FAFC] p-4 sm:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPreview.image}
                alt={selectedPreview.title}
                className="max-h-[70vh] w-auto rounded-lg object-contain shadow-lg ring-1 ring-black/10"
              />
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] bg-white px-6 py-3.5 text-xs text-[#64748B]">
              <span>
                {selectedPreview.registrationNumber
                  ? `Ref: ${selectedPreview.registrationNumber}`
                  : ""}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedPreview.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-1.5 font-medium text-[#0A1542] hover:bg-[#F1F5F9]"
                >
                  <HugeiconsIcon
                    icon={Download01Icon}
                    size={14}
                    color="currentColor"
                  />
                  <span>Open Raw File</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPreview(null)}
                  className="rounded-lg bg-primary px-4 py-1.5 font-medium text-white hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
