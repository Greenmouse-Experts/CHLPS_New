import Image from "next/image";
import Link from "next/link";
import { Assets } from "@/lib/assets";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

const associationLinks = [
  { label: "About", href: "#about" },
  { label: "Membership", href: "#membership" },
  { label: "Programs", href: "#programs" },
];

const resourceLinks = [
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

const contactLinks = [
  { label: "info@chlps.ca", href: "mailto:info@chlps.ca" },
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
      <p className="text-secondary text-[11px] font-medium uppercase tracking-[0.16em] mb-4">
        {title}
      </p>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-lilac text-sm hover:text-white transition-colors duration-200"
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
    <footer className="bg-primary pt-16 md:pt-20 pb-8 md:pb-10">
      <PageContainer>
        <RevealGroup className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-8">
          <div className="reveal max-w-xs" style={revealStyle(0)}>
            <Link href="/" className="inline-block bg-white rounded-xl px-3 py-2">
              <Image
                src={Assets.icons.logo}
                alt="CHLPS"
                width={180}
                height={48}
                className="w-36 h-auto"
              />
            </Link>
            <p className="mt-4 text-lilac text-sm leading-relaxed">
              Association of Chartered Loss Prevention Specialists of Canada.
              Advancing professional standards in loss prevention.
            </p>
          </div>

          <div className="reveal" style={revealStyle(1)}>
            <FooterColumn title="Association" links={associationLinks} />
          </div>
          <div className="reveal" style={revealStyle(2)}>
            <FooterColumn title="Resources" links={resourceLinks} />
          </div>
          <div className="reveal" style={revealStyle(3)}>
            <FooterColumn title="Contact" links={contactLinks} />
          </div>
        </RevealGroup>

        <div className="mt-16 md:mt-20 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <p className="text-lilac/80 text-xs">
            © {new Date().getFullYear()} Association of Chartered Loss Prevention
            Specialists of Canada. All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
