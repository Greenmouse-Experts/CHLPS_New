import { Assets } from "@/lib/assets";

export type EventStatus = "live" | "upcoming" | "past";
export type EventAccess = "free" | "paid";
export type EventCategory =
  | "Webinar"
  | "Seminar"
  | "Conference"
  | "Workshop"
  | "Professional Forum";

export type ChlpsEvent = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  access: EventAccess;
  date: string;
  duration: string;
  location: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
};

export const events: ChlpsEvent[] = [
  {
    id: "loss-prevention-leadership-forum",
    title: "Loss Prevention Leadership Forum",
    description:
      "A live professional forum focused on leadership, operational resilience and practical approaches to modern loss prevention.",
    category: "Professional Forum",
    status: "live",
    access: "free",
    date: "07 Sep 2026",
    duration: "2 Hours",
    location: "Online",
    image: Assets.images.events.liveForum,
    imageAlt:
      "Loss prevention professionals collaborating around a laptop during a live forum",
  },
  {
    id: "introduction-to-modern-loss-prevention",
    title: "Introduction to Modern Loss Prevention",
    description:
      "A practical introduction to the principles, roles and operating models that shape modern loss prevention practice.",
    category: "Webinar",
    status: "upcoming",
    access: "free",
    date: "12 Sep 2024",
    duration: "90 Minutes",
    location: "Online",
    image: Assets.images.events.webinar,
    imageAlt:
      "Loss prevention professionals reviewing operations together on a tablet",
  },
  {
    id: "fraud-prevention-investigation-seminar",
    title: "Fraud Prevention & Investigation Seminar",
    description:
      "Explore investigation methods, fraud risk indicators and applied approaches used in professional loss prevention environments.",
    category: "Seminar",
    status: "upcoming",
    access: "paid",
    date: "18 Sep 2024",
    duration: "1 Day",
    location: "Ottawa, Canada",
    image: Assets.images.events.seminar,
    imageAlt:
      "A loss prevention professional standing in a collaborative office meeting",
  },
  {
    id: "loss-prevention-professionals-conference",
    title: "Loss Prevention Professionals Conference",
    description:
      "A flagship gathering of loss prevention professionals for knowledge exchange, industry discussion and professional development.",
    category: "Conference",
    status: "upcoming",
    access: "paid",
    date: "03 Oct 2024",
    duration: "2 Days",
    location: "Windsor, Canada",
    image: Assets.images.events.conference,
    imageAlt:
      "A speaker presenting to professionals at a loss prevention conference",
  },
  {
    id: "building-a-career-in-loss-prevention",
    title: "Building a Career in Loss Prevention",
    description:
      "Insights on building a sustainable career pathway across loss prevention, corporate security and related disciplines.",
    category: "Webinar",
    status: "past",
    access: "free",
    date: "22 Jun 2024",
    duration: "2 Hours",
    location: "Online",
    image: Assets.images.events.career,
    imageAlt:
      "Professionals in conversation at a CHLPS career development event",
    imageClassName: "object-cover object-[right_center]",
  },
  {
    id: "compliance-ethics-in-security-practice",
    title: "Compliance & Ethics in Security Practice",
    description:
      "A workshop examining ethical decision-making, professional standards and compliance in security practice.",
    category: "Workshop",
    status: "past",
    access: "paid",
    date: "14 May 2024",
    duration: "1 Day",
    location: "Toronto, Canada",
    image: Assets.images.events.compliance,
    imageAlt: "CHLPS professionals standing together after a workshop session",
  },
  {
    id: "security-operations-incident-response-forum",
    title: "Security Operations & Incident Response Forum",
    description:
      "A professional forum on operational response, incident handling and coordinated security practice.",
    category: "Professional Forum",
    status: "past",
    access: "free",
    date: "28 Mar 2024",
    duration: "2 Hours",
    location: "Online",
    image: Assets.images.events.operations,
    imageAlt:
      "Security and loss prevention professionals gathered for a forum discussion",
  },
];

export function getEventsByStatus(status: EventStatus) {
  return events.filter((event) => event.status === status);
}

export function getEventById(id: string) {
  return events.find((event) => event.id === id);
}
