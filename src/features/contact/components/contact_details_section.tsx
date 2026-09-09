import type { ReactNode } from "react";
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
} from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import ContactForm from "@/features/contact/components/contact_form";
import { Assets } from "@/lib/assets";

const GOLD = "#CDA54E";

const socialLinks: { label: string; href: string; icon: IconSvgElement }[] = [
  { label: "LinkedIn", href: "#", icon: Linkedin01Icon },
  { label: "Facebook", href: "#", icon: Facebook01Icon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
];

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: IconSvgElement;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-secondary bg-white">
        <HugeiconsIcon icon={icon} size={16} color={GOLD} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-secondary">
          {label}
        </p>
        <div className="mt-1 text-[13px] leading-[1.55] text-[#0A1542]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContactDetailsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={Assets.images.atAGlanceBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="min-w-0">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-[12px]">
                Office Details
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-3 text-[1.625rem] font-medium leading-[1.2] tracking-tight text-[#0A1542] sm:text-[2rem]">
                Get in touch with
                <br />
                ChLPS Canada
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-3 max-w-[360px] text-[13px] leading-relaxed text-[#6F6E7A] sm:text-[14px]">
                Reach our team directly or send us a message using the form.
                We&apos;ll make sure your enquiry gets to the right place.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-6 max-w-[400px] divide-y divide-[#EADFC4] rounded-[14px] border border-[#E8D9B8] bg-[#FCF7EA] px-5 py-4">
                <DetailRow icon={Location01Icon} label="Office">
                  Victoria Avenue, Windsor
                  <br />
                  Ontario N9A 4N1, Canada
                </DetailRow>

                <DetailRow icon={CallIcon} label="Phone">
                  <a
                    href="tel:+19054522470"
                    className="transition-colors duration-200 hover:text-primary"
                  >
                    +1 905 452 2470
                  </a>
                </DetailRow>

                <DetailRow icon={Mail01Icon} label="Email">
                  <a
                    href="mailto:info@chlpscanada.ca"
                    className="transition-colors duration-200 hover:text-primary"
                  >
                    info@chlpscanada.ca
                  </a>
                </DetailRow>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-[12px]">
                Social Media
              </p>
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary bg-white transition-colors duration-200 hover:bg-cream"
                  >
                    <HugeiconsIcon
                      icon={social.icon}
                      size={17}
                      color={GOLD}
                      strokeWidth={1.8}
                    />
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="min-w-0">
            <ContactForm />
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
