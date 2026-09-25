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
    membership.certificationImage ||
    imgUrl ||
    (membership.badge && membership.badge.startsWith("http")
      ? membership.badge
      : undefined);

  if (!imgSrc) {
    return null;
  }

  const title = membership.gradeTitle || membership.title || "Membership";

  return (
    <section className="bg-white py-14 sm:py-8">
      <PageContainer>
        <Reveal>
          <article className="overflow-hidden rounded-[1.75rem] border border-[#D4B56A] bg-[#F6F5FB] lg:rounded-[2rem]">
            <div className="grid items-center lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
              <div className="relative flex items-center justify-center p-6 sm:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={`${title} Certificate`}
                  className="h-auto w-full max-w-xl rounded-[0.9rem] object-contain shadow-[0_16px_36px_rgba(10,21,66,0.18)] sm:rounded-[1.05rem]"
                />
              </div>

              <div className="flex flex-col justify-center bg-[#0A1542] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-12">
                <h2 className="text-3xl font-semibold uppercase text-secondary sm:text-4xl">
                  {title} <span className="text-white">Certificate</span>
                </h2>
                {membership.certificationText}
                {/*{membership.gradeBody && (
                  <p className="mt-5 max-w-[28rem] text-sm leading-[1.7] text-white/90 sm:mt-6 sm:text-base">
                    {membership.gradeBody}
                  </p>
                )}*/}
              </div>
            </div>
          </article>
        </Reveal>
      </PageContainer>
    </section>
  );
}
