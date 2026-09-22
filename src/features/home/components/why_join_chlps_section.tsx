import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";
import { Assets } from "@/lib/assets";

export interface WhyJoinCardItem {
  title: string;
  description: string;
  img?: string;
}

export const WHY_JOIN_CHLPS_CARDS: WhyJoinCardItem[] = [
  {
    title: "Professional Recognition",
    description:
      "Strengthen your professional standing through membership and certification pathways that recognize competence, experience, ethical practice, and commitment to excellence in Loss Prevention.",
    img: "/professional_recognition.png",
  },
  {
    title: "Career Advancement",
    description:
      "Build a stronger professional profile and progress through structured pathways that support career development from emerging practitioner to management, leadership, and chartered professional status.",
    img: "/career_advancement.png",
  },
  {
    title: "Continuous Professional Development",
    description:
      "Keep your knowledge current through professional education, training, webinars, industry resources, and development opportunities addressing evolving risks, technologies, regulations, and Loss Prevention practices.",
    img: "/continous_professional_development.png",
  },
  {
    title: "Professional Network",
    description:
      "Connect with Loss Prevention practitioners, corporate security leaders, investigators, risk professionals, consultants, educators, and industry partners to exchange knowledge, build relationships, and expand professional opportunities.",
    img: "/professional_network.png",
  },
  {
    title: "Industry Knowledge and Resources",
    description:
      "Gain access to professional insights, practice guidance, emerging trends, research, and specialist resources that strengthen decision making and improve Loss Prevention effectiveness within your organization.",
    img: "/industry_knowledge.png",
  },
  {
    title: "Professional Voice & Industry Influence",
    description:
      "Become part of a professional community advancing Loss Prevention standards, ethical practice, professional recognition, and industry development while helping shape the future of the profession in Canada and beyond.",
    img: "/professional_voice.png",
  },
];

export default function WhyJoinChlpsSection() {
  return (
    <section className="bg-white py-14 sm:py-18 lg:py-24">
      <PageContainer>
        {/* Header */}
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <HeaderText left="WHY JOIN" right="CHLPS-CANADA" />
          <div className="mt-4">
            <HeaderSubText>
              Advance your expertise, strengthen your professional credibility,
              and become part of a community committed to excellence in Loss
              Prevention. Through recognized certifications, continuous
              professional development, industry resources, knowledge sharing,
              and connections with experienced practitioners, you gain the
              competence, recognition, confidence, and professional network
              needed to protect organizations and accelerate career growth.
            </HeaderSubText>
          </div>
        </div>

        {/* 6 Cards Grid */}
        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {WHY_JOIN_CHLPS_CARDS.map((card, index) => (
            <article
              key={card.title}
              className="reveal relative isolate flex flex-col  overflow-hidden rounded-[20px] bg-[#34276F] p-7 text-center text-white shadow-[0_10px_25px_rgba(22,16,88,0.14)] min-h-[280px] sm:min-h-[300px]"
              style={revealStyle(index)}
            >
              {/* Card background artwork */}
              <Image
                src={Assets.images.whyJoinCardBg}
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="pointer-events-none -z-10 object-cover object-center"
              />

              <div className="relative z-10">
                <h3 className=" font-semibold leading-snug text-white ">
                  {card.title}
                </h3>
              </div>
              <img
                className="size-32 mx-auto"
                src={`/assets/images/why_join_section/${card.img}`}
                alt={card.title}
              />

              {/* Icon slot left empty for now as requested */}
              {/*<div className="relative z-10 my-auto py-2" />*/}

              <div className="relative z-10 ">
                <p className=" font-normal leading-[1.68] text-white/90 ]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </RevealGroup>

        {/* Bottom CTA Button */}
        <Reveal delay={120} className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/membership"
            className="inline-flex items-center gap-3 rounded-full bg-secondary px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_6px_20px_rgba(205,165,78,0.35)] transition-all duration-200 hover:brightness-105 active:scale-[0.99]"
          >
            <span>Explore Membership</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                color="#CDA54E"
                strokeWidth={2.4}
              />
            </span>
          </Link>
        </Reveal>
      </PageContainer>
    </section>
  );
}
