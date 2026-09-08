import type { ReactNode } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";

type EventSectionHeaderProps = {
  icon: IconSvgElement;
  iconColor: string;
  iconBg?: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
  viewAllHref?: string;
};

export default function EventSectionHeader({
  icon,
  iconColor,
  iconBg = "#EFECFB",
  title,
  subtitle,
  action,
  viewAllHref,
}: EventSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 ">
      <Reveal className="min-w-0">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div
            className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px]"
            style={{ backgroundColor: iconBg }}
          >
            <HugeiconsIcon
              icon={icon}
              size={22}
              color={iconColor}
              strokeWidth={1.8}
              className="shrink-0"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-[1.5rem] font-semibold leading-tight tracking-tight text-[#161058] sm:text-[1.75rem] lg:text-[2rem]">
              {title}
            </h2>
            <p className="mt-1 text-[14px] text-[#8A8A96] sm:text-[15px]">
              {subtitle}
            </p>
          </div>
        </div>
      </Reveal>

      {action ? (
        <Reveal delay={80} className="shrink-0">
          {action}
        </Reveal>
      ) : viewAllHref ? (
        <Reveal delay={80} className="shrink-0">
          <Link
            href={viewAllHref}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-primary bg-white px-4 text-[13px] font-semibold text-primary transition-colors duration-200 hover:bg-lilac sm:h-11 sm:px-5 sm:text-sm"
          >
            View All
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              color="currentColor"
              strokeWidth={2}
            />
          </Link>
        </Reveal>
      ) : null}
    </div>
  );
}
