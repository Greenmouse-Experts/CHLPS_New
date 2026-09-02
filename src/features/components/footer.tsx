import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CallIcon,
  Facebook01Icon,
  InstagramIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { Assets } from "@/lib/assets";
import PageContainer from "@/features/components/page_container";

const GOLD = "#CDA54E";
const NAVY = "#0B0A3A";

const exploreLinks = [
  { label: "Membership", href: "#membership" },
  { label: "Certifications", href: "#certification" },
  { label: "About Us", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "News & Blogs", href: "#news" },
  { label: "CareerCentre", href: "#careers" },
];

const supportLinks = [
  { label: "FAQs", href: "#faq" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Code of Ethics", href: "#ethics" },
  { label: "My ChLPS", href: "/dashboard/sign-in" },
];

const socialLinks: { label: string; href: string; icon: IconSvgElement }[] = [
  { label: "Facebook", href: "#", icon: Facebook01Icon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "LinkedIn", href: "#", icon: Linkedin01Icon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.14em] text-secondary">
        {title}
      </p>
      <ul className="flex flex-col gap-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-[14px] text-white transition-colors duration-200 hover:text-secondary"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={12}
                color={GOLD}
                strokeWidth={2.2}
                className="shrink-0"
              />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0B0A3A] pt-16 md:pt-20 lg:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={Assets.images.footerBg}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.72fr)_minmax(0,0.72fr)_minmax(0,1.15fr)] lg:gap-x-10 xl:gap-x-16">
          <div className="sm:col-span-2 lg:col-auto lg:max-w-[22.5rem]">
            <Link href="/" className="flex items-center gap-3.5">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={Assets.icons.logo}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover object-left"
                />
              </span>
              <span className="text-[13px] font-bold uppercase leading-[1.3] tracking-[0.02em] text-white">
                Association of Chartered Loss Prevention Specialists of Canada
              </span>
            </Link>
            <p className="mt-6 text-[14px] leading-[1.7] text-white">
              ChLPS Canada is a professional membership and certification body
              advancing excellence in loss prevention, corporate security, and
              asset protection through training, certification, and professional
              development.
            </p>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Support" links={supportLinks} />

          <div>
            <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.14em] text-secondary">
              Contact
            </p>
            <ul className="flex flex-col gap-4 text-[14px] leading-[1.5] text-white">
              <li className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={18}
                  color={GOLD}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                />
                <span>
                  Victoria Avenue Suite 3 Windsor Ontario
                  <br />
                  N9A 4N1 Canada
                </span>
              </li>
              <li>
                <a
                  href="tel:+19054522470"
                  className="flex items-start gap-3 transition-colors hover:text-secondary"
                >
                  <HugeiconsIcon
                    icon={CallIcon}
                    size={18}
                    color={GOLD}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0"
                  />
                  +1 905-452-2470
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@chlpscanada.ca"
                  className="flex items-start gap-3 transition-colors hover:text-secondary"
                >
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={18}
                    color={GOLD}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0"
                  />
                  info@chlpscanada.ca
                </a>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-transform hover:scale-105"
                >
                  <HugeiconsIcon
                    icon={social.icon}
                    size={16}
                    color={NAVY}
                    strokeWidth={1.8}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pb-8 text-center md:mt-20 md:pb-10 lg:mt-24">
          <p className="text-[12px] leading-relaxed text-white sm:text-[13px]">
            © 2026 Association of Chartered Loss Prevention Specialists of
            Canada.
          </p>
          <p className="mt-1 text-[12px] text-white sm:text-[13px]">
            All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
