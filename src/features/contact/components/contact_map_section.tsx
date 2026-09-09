import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";

const OFFICE_QUERY = "Victoria Ave, Windsor, ON N9A 4N1, Canada";
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  OFFICE_QUERY,
)}&z=15&hl=en&output=embed`;

export default function ContactMapSection() {
  return (
    <section id="find-us" className="bg-white py-14 sm:py-16 lg:py-20">
      <PageContainer>
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-[12px]">
            Find Us
          </p>
        </Reveal>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <Reveal delay={80} className="min-w-0">
            <h2 className="text-[1.5rem] font-semibold leading-tight tracking-tight text-[#0A1542] sm:text-[1.75rem]">
              Visit our Windsor office
            </h2>
          </Reveal>

          <Reveal delay={140} className="shrink-0">
            <p className="text-[13px] text-[#6F6E7A] sm:text-[14px]">
              Our office is located on Victoria Avenue in Windsor, Ontario.
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="mt-6 h-[320px] w-full overflow-hidden rounded-[14px] border border-[#E8D9B8] sm:h-[420px]">
            <iframe
              src={MAP_EMBED}
              title="Map showing the ChLPS Canada office on Victoria Avenue, Windsor, Ontario"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
