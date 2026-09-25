"use client";

import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import type { MembershipType } from "@/features/membership/membership_types";

export default function MembershipCertificationImage(props: {
  membership: MembershipType;
  imgUrl?: string;
}) {
  const { membership, imgUrl } = props;
  const imgSrc =
    membership.certificationImage || imgUrl || "/assets/images/cert.png";

  const rawTitle =
    membership.gradeTitle || membership.title || "Student Membership";
  const titleWords = rawTitle.trim().split(/\s+/);
  const titleLead =
    titleWords.length > 1 ? titleWords.slice(0, -1).join(" ") : titleWords[0];
  const titleAccent =
    titleWords.length > 1 ? titleWords[titleWords.length - 1] : "Membership";

  const bodyParagraphs = membership.certificationText
    ? membership.certificationText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [
        `Congratulations on earning the ${rawTitle} professional certification. This achievement reflects your dedication to professional growth and readiness to contribute confidently to modern loss prevention work. The certification enhances your credibility, strengthens your operational skills, and positions you for roles in retail security.`,
        `Certification holders gain improved employability, access to industry networks, and a solid foundation for advanced certifications. It is a meaningful step toward a rewarding career in loss prevention and corporate security.`,
      ];

  return (
    <section className="bg-white py-14 sm:py-8">
      <PageContainer>
        <Reveal>
          <article className="overflow-hidden rounded-[1.75rem] border border-secondary ring-1 ring-secondary bg-white shadow-[0_20px_50px_rgba(22,16,88,0.06)] lg:rounded-[2rem]">
            <div className="grid items-center lg:grid-cols-2 grid ">
              {/* Left Side: Framed Certificate */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="h-[505px] p-5 flex items-center justify-center">
                <img
                  src={imgSrc}
                  alt={`${rawTitle} Certificate`}
                  className="h-full rounded-xl bg-white object-contain"
                />
              </div>

              {/* Right Side: Navy Content Panel */}
              <div className="flex h-full flex-col justify-center bg-[#0A1542] px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  {titleLead}{" "}
                  <span className="text-secondary">{titleAccent}</span>
                </h2>

                <div className="mt-5 space-y-4 sm:mt-6">
                  {bodyParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-relaxed text-white/90 sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </PageContainer>
    </section>
  );
}
