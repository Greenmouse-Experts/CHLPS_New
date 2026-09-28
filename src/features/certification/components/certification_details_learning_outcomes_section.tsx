"use client";

import { Check } from "lucide-react";
import PageContainer from "@/features/components/page_container";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import type { CertificationDetail } from "@/features/certification/certification_details";

const DEFAULT_LEARNING_OUTCOMES = [
  "Analyze operational risks in retail and distribution environments",
  "Contribute to organizational loss prevention strategies",
  "Apply surveillance and monitoring techniques effectively",
  "Prepare structured security/loss prevention incident reports and documentation",
  "Identify fraud and theft patterns",
  "Understand compliance requirements and ethical standards",
  "Implement evidence preservation and investigative protocols",
  "Formulate emergency response and workplace safety measures",
  "Evaluate physical security controls and access management",
  "Uphold regulatory compliance, confidentiality, and legal boundaries",
];

const PROGRAM_LEARNING_OUTCOMES: Record<string, string[]> = {
  clpa: [
    "Analyze operational risks in retail and distribution environments",
    "Contribute to organizational loss prevention strategies",
    "Apply surveillance and monitoring techniques effectively",
    "Prepare structured security/loss prevention incident reports and documentation",
    "Identify fraud and theft patterns",
    "Understand compliance requirements and ethical standards",
    "Implement evidence preservation and investigative protocols",
    "Formulate emergency response and workplace safety measures",
    "Evaluate physical security controls and access management",
    "Uphold regulatory compliance, confidentiality, and legal boundaries",
  ],
  bclp: [
    "Analyze operational risks in retail and distribution environments",
    "Contribute to organizational loss prevention strategies",
    "Apply surveillance and monitoring techniques effectively",
    "Prepare structured security/loss prevention incident reports and documentation",
    "Identify fraud and theft patterns",
    "Understand compliance requirements and ethical standards",
    "Implement evidence preservation and investigative protocols",
    "Formulate emergency response and workplace safety measures",
    "Evaluate physical security controls and access management",
    "Uphold regulatory compliance, confidentiality, and legal boundaries",
  ],
  clpo: [
    "Execute frontline asset protection and deterrence procedures",
    "Conduct structured patrol routines and incident documentation",
    "Operate modern CCTV and surveillance monitoring tools",
    "Identify shoplifting, internal shrinkage, and organized retail crime indicators",
    "Apply de-escalation tactics and conflict resolution techniques",
    "Enforce site access controls and visitor verification protocols",
    "Prepare compliant incident narratives and evidence dossiers",
    "Collaborate with law enforcement and emergency response services",
    "Maintain high standards of ethical security conduct and human rights compliance",
    "Assist in shrinkage audit reviews and facility vulnerability assessments",
  ],
  clpm: [
    "Design and execute enterprise-wide loss prevention strategies",
    "Lead loss prevention teams, shift supervisors, and field investigators",
    "Conduct root-cause analysis on retail shrinkage and operational losses",
    "Develop internal audit programs and exception-based monitoring controls",
    "Oversee high-stakes corporate investigations and fraud resolution",
    "Manage physical security infrastructure, contracts, and vendor budgets",
    "Formulate crisis response plans and business continuity procedures",
    "Deliver executive-level risk reporting and compliance presentations",
    "Implement inventory shrinkage reduction policies across supply chains",
    "Ensure cross-functional alignment with legal, HR, and operations departments",
  ],
  aclpm: [
    "Architect advanced loss prevention management systems across enterprise operations",
    "Formulate risk mitigation models for supply chain and distribution networks",
    "Lead multi-store investigations involving organized retail crime and internal fraud",
    "Audit compliance with national security regulations and corporate policies",
    "Direct crisis management, executive protection, and critical incident response",
    "Deploy data analytics to forecast shrinkage trends and inventory vulnerabilities",
    "Establish asset protection operational budgets and vendor performance metrics",
    "Develop cross-departmental training programs in loss reduction and ethics",
    "Collaborate with regulatory agencies, legal counsel, and law enforcement",
    "Champion ethical leadership, continuous professional standards, and governance",
  ],
  chlps: [
    "Lead strategic governance and executive risk management frameworks",
    "Formulate multi-jurisdictional loss prevention policy and compliance standards",
    "Direct complex forensic investigations and corporate asset protection",
    "Architect integrated security technologies, AI surveillance, and predictive controls",
    "Conduct enterprise risk assessments across complex supply chain networks",
    "Advise board members and senior executives on corporate loss exposure",
    "Establish rigorous professional and ethical codes for organizational security",
    "Spearhead regulatory compliance across Canadian legal standards",
    "Lead cross-border crisis mitigation and emergency response programs",
    "Mentor future loss prevention leaders and champion industry best practices",
  ],
};

export default function CertificationDetailsLearningOutcomesSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  const abbrKey = detail.abbr?.toLowerCase() || "";

  // 1. Check API course outcomes
  // 2. Check program specific outcomes
  // 3. Fallback to default learning outcomes
  const outcomes =
    detail.courseOutcomes && detail.courseOutcomes.length > 0
      ? detail.courseOutcomes
      : PROGRAM_LEARNING_OUTCOMES[abbrKey] || DEFAULT_LEARNING_OUTCOMES;

  return (
    <section className="border-y border-[#EAE3D2]/70 bg-[#FAF8F5] py-14 sm:py-16 lg:py-20">
      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <Reveal delay={80}>
            <h2 className="text-2xl font-bold tracking-wide uppercase sm:text-3xl lg:text-4xl">
              <span className="text-[#18124A]">LEARNING</span>{" "}
              <span className="text-[#C8A854]">OUTCOME</span>
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="mt-8 grid grid-cols-1 gap-3.5 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:gap-5">
          {outcomes.map((outcome, index) => (
            <article
              key={`${outcome}-${index}`}
              className="reveal flex items-center gap-4 rounded-2xl border border-[#E5D7B5] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)] transition-shadow duration-200 hover:shadow-md sm:px-6 sm:py-5"
              style={revealStyle(index)}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#18124A] text-white sm:h-10 sm:w-10">
                <Check className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.8} />
              </span>
              <p className="min-w-0 text-sm font-semibold leading-snug text-[#18124A] sm:text-[15px]">
                {outcome}
              </p>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
