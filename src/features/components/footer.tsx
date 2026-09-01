import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
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

const exploreLinks = [
  { label: "Membership", href: "#membership" },
  { label: "Certification", href: "#certification" },
  { label: "About Us", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Jobs", href: "#careers" },
];

const supportLinks = [
  { label: "FAQs", href: "#faq" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Code of Ethics", href: "#ethics" },
  { label: "Login / Register", href: "/dashboard/sign-in" },
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
      <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.16em] text-secondary">
        {title}
      </p>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[14px] text-white/90 transition-colors duration-200 hover:text-secondary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#130F44] pt-16 md:pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={Assets.images.footerPattern}
          alt=""
          fill
          className="object-cover object-center opacity-5 mix-blend-screen"
          sizes="100vw"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] z-0 w-[min(34rem,80vw)] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src={Assets.images.footerLogo}
          alt=""
          width={2560}
          height={2528}
          className="h-auto w-full opacity-70 mix-blend-screen"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">
          <div className="max-w-xs sm:max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative h-[3.75rem] w-[3.75rem] shrink-0 overflow-hidden rounded-full sm:h-16 sm:w-16">
                <Image
                  src={Assets.icons.logo}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover object-left"
                />
              </span>
              <span className="text-[12px] font-bold uppercase leading-snug tracking-[0.02em] text-white sm:text-[13px]">
                Association of Chartered Loss Prevention Specialists of Canada
              </span>
            </Link>
            <p className="mt-5 text-[13px] leading-relaxed text-white/85 sm:text-sm">
              Advancing loss prevention through membership, certification and
              professional development.
            </p>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Support" links={supportLinks} />

          <div>
            <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.16em] text-secondary">
              Contact
            </p>
            <ul className="flex flex-col gap-4 text-[13px] text-white/90 sm:text-sm">
              <li className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={18}
                  color="#ffffff"
                  strokeWidth={1.8}
                />
                <span className="leading-relaxed">
                  Victoria Avenue Windsor
                  <br />
                  Ontario N9A 4N1 Canada
                </span>
              </li>
              <li>
                <a
                  href="tel:+14375451684"
                  className="flex items-center gap-3 transition-colors hover:text-secondary"
                >
                  <HugeiconsIcon
                    icon={CallIcon}
                    size={18}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                  +1 437-545-1684
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@chlpscanada.ca"
                  className="flex items-center gap-3 transition-colors hover:text-secondary"
                >
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={18}
                    color="currentColor"
                    strokeWidth={1.8}
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
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-[#111E2A] transition-transform hover:scale-105"
                >
                  <HugeiconsIcon
                    icon={social.icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 py-6 text-center md:mt-16 md:py-8">
          <p className="text-[11px] leading-relaxed text-white/80 sm:text-xs">
            CLPA™, CLPO™, CLPM™, ChLPS™ are Trademarks of the Association of
            Chartered Loss Prevention Specialists of Canada
          </p>
          <p className="mt-2 text-[11px] text-white/80 sm:text-xs">
            © 2026 Association of Chartered Loss Prevention Specialists of
            Canada. All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
