import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  ShieldCheckIcon,
  ShoppingBag01Icon,
  BoxesIcon,
  ClipboardCheckIcon,
  ChartHistogramIcon,
  DeliveryTruck01Icon,
  Building03Icon,
  Award01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";
import type { CertificationDetail } from "@/features/certification/certification_details";

export type CertificationJobCard = {
  icon?: IconSvgElement;
  title: string;
  body: string;
};

const DEFAULT_ICONS: IconSvgElement[] = [
  Briefcase01Icon,
  ShieldCheckIcon,
  ShoppingBag01Icon,
  BoxesIcon,
  ClipboardCheckIcon,
  ChartHistogramIcon,
  DeliveryTruck01Icon,
  Building03Icon,
  Award01Icon,
  UserCheck01Icon,
];

type CertificationDetailsJobsSectionProps = {
  detail?: CertificationDetail | null;
  badge?: string;
  title?: string;
  body?: string;
  cards?: CertificationJobCard[];
};

export default function CertificationDetailsJobsSection({
  detail,
  body,
  cards,
}: CertificationDetailsJobsSectionProps) {
  const cardsToRender: CertificationJobCard[] =
    cards && cards.length > 0
      ? cards
      : (detail?.jobOpportunities || []).map((job, idx) => ({
          icon: (job as any).icon || DEFAULT_ICONS[idx % DEFAULT_ICONS.length],
          title: job.title,
          body: job.description || job.body || "",
        }));

  if (!cardsToRender || cardsToRender.length === 0) {
    return null;
  }

  const sectionBody =
    body ||
    (detail?.abbr
      ? `The ${detail.abbr} certification prepares professionals for diverse career pathways across loss prevention, asset protection, and risk management.`
      : "Explore rewarding career pathways and roles enabled by this professional certification.");

  return (
    <section className="bg-white py-8 lg:py-12">
      <PageContainer>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="w-full">
            <HeaderText left="career" right="opportunities" />
            <HeaderSubText smallWidth>{sectionBody}</HeaderSubText>
          </div>
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {cardsToRender.map((card, index) => {
            const Icon = card.icon || DEFAULT_ICONS[index % DEFAULT_ICONS.length];
            return (
              <article
                key={card.title + index}
                className="reveal flex h-full items-start gap-3.5 rounded-[1.25rem] border border-[#CDA54E] bg-white p-5 shadow-[0_10px_28px_rgba(33,26,115,0.06)] sm:gap-4 sm:p-6"
                style={revealStyle(index)}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.85rem] bg-[#EDEAF88C] sm:h-12 sm:w-12">
                  <HugeiconsIcon
                    icon={Icon}
                    size={22}
                    color="#211A73"
                    strokeWidth={1.8}
                  />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-[#221A7A] sm:text-[17px]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#676672]">
                    {card.body}
                  </p>
                </div>
              </article>
            );
          })}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
