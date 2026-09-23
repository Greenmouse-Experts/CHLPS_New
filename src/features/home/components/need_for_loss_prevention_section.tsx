import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Alert02Icon,
  ChartLineData02Icon,
  LockIcon,
  Settings01Icon,
  Shield01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";
import { Assets } from "@/lib/assets";

export interface NeedCardItem {
  title: string;
  description: string;
  icon: IconSvgElement;
}

export const NEED_FOR_LOSS_PREVENTION_CARDS: NeedCardItem[] = [
  {
    title: "Protect Business Assets",
    description:
      "Safeguard people, property, inventory, information, technology, facilities, and other critical assets from theft, fraud, damage, misuse, and unauthorized access.",
    icon: Shield01Icon,
  },
  {
    title: "Prevent Business Losses",
    description:
      "Identify vulnerabilities and address the underlying causes of preventable losses before they escalate, reducing theft, fraud, errors, waste, abuse, and operational failures.",
    icon: LockIcon,
  },
  {
    title: "Preserve Profitability",
    description:
      "Reduce the financial impact of shrinkage, fraud, inventory losses, waste, and operational inefficiencies that erode margins and weaken the business bottom line.",
    icon: ChartLineData02Icon,
  },
  {
    title: "Manage Business Risks",
    description:
      "Identify, assess, prioritize, and control emerging loss exposures across retail, corporate, supply chain, digital, and operational environments before they significantly affect the organization.",
    icon: Alert02Icon,
  },
  {
    title: "Strengthen Organizational Resilience",
    description:
      "Prepare organizations to withstand disruptive events, maintain critical operations, respond effectively to incidents, and recover quickly while minimizing financial and operational consequences.",
    icon: Settings01Icon,
  },
  {
    title: "Protect Reputation & Business Continuity",
    description:
      "Protect customer confidence, stakeholder trust, and brand reputation by preventing and controlling incidents capable of causing significant financial, operational, or reputational harm.",
    icon: UserGroupIcon,
  },
];

export default function NeedForLossPreventionSection() {
  return (
    <section id="need-for-lp" className="bg-cream py-16 md:py-24">
      <PageContainer>
        {/* Section Header */}
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <HeaderText left="THE NEED FOR" right="LOSS PREVENTION" />
          <div className="mt-4">
            <HeaderSubText>
              Effective Loss Prevention protects assets, preserves
              profitability, strengthens resilience, and safeguards
              organizational value. Every preventable loss can affect
              profitability, operations, reputation, assets, and business
              continuity. Modern Loss Prevention provides a strategic approach
              to identifying risks, preventing theft and fraud, reducing
              operational losses, and strengthening controls. Skilled
              professionals help organizations anticipate vulnerabilities,
              protect critical assets, preserve profits, and build stronger
              organizational resilience.
            </HeaderSubText>
          </div>
        </div>

        {/* 6 Cards Grid (2 columns) */}
        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 max-w-5xl mx-auto">
          {NEED_FOR_LOSS_PREVENTION_CARDS.map((card, index) => (
            <article
              key={card.title}
              className="reveal relative isolate flex flex-col items-center justify-center overflow-hidden rounded-[24px] bg-white px-6 py-8 text-center transition-transform duration-200 hover:-translate-y-1 sm:px-8 sm:py-10  ring-secondary ring-2
              "
              style={revealStyle(index)}
            >
              {/* Card background graphic */}
              <Image
                src={Assets.images.whyJoinCardBgWhite}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="pointer-events-none -z-10 object-cover object-center"
              />

              {/* Icon badge */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF4E8] text-[#1E1758] sm:h-14 sm:w-14">
                <HugeiconsIcon
                  icon={card.icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={2}
                />
              </div>

              {/* Title */}
              <h3 className="relative z-10 mt-4 text-[19px] font-bold leading-snug text-[#151515] sm:text-[21px]">
                {card.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 mx-auto mt-2 max-w-[440px]  leading-relaxed">
                {card.description}
              </p>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
