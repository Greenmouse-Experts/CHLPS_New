import AtAGlanceSection, {
  type GlanceCard,
} from "@/features/home/components/at_a_glance_section";

const cards: GlanceCard[] = [
  {
    value: "6",
    title: "Membership levels",
    body: "A structured pathway from Student and Affiliate through to Certified and Corporate membership.",
    badge: "6 pathways",
    tone: "primary",
  },
  {
    value: "12",
    title: "Month membership cycle",
    body: "Membership is structured around an annual subscription cycle across the available grades.",
    badge: "Annual",
    tone: "lilac",
  },
  {
    value: "2",
    title: "Membership routes",
    body: "Individual professional grades and a Corporate route for organisations developing their teams.",
    badge: "2 routes",
    tone: "gold",
    badgeVariant: "outline",
  },
];

export default function MembershipGlanceSection() {
  return (
    <AtAGlanceSection
      id="membership-overview"
      heading="Membership built around where you are now, and where you want to go next."
      body="ChLPS Canada supports professional growth through certification, learning, networking and structured career development."
      cards={cards}
    />
  );
}
