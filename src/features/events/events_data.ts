export type EventStatus = "live" | "upcoming" | "past";
export type EventAccess = "free" | "paid";
export type EventCategory =
  | "Webinar"
  | "Seminar"
  | "Conference"
  | "Workshop"
  | "Masterclass"
  | "Professional Forum";

export type ChlpsEvent = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  access: EventAccess;
  date: string;
  time: string;
  duration: string;
  location: string;
  address?: string;
  ticketPrice: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
  gallery: string[];
};

const testImage = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

const meetingGallery = [
  testImage("photo-1600880292203-757bb62b4baf"),
  testImage("photo-1552664730-d307ca884978"),
  testImage("photo-1556761175-4b46a572b786"),
];

const virtualGallery = [
  testImage("photo-1588196749597-9ff075ee6b5b"),
  testImage("photo-1573497019940-1c28c88b4f3e"),
  testImage("photo-1516321318423-f06f85e504b3"),
];

const conferenceGallery = [
  testImage("photo-1475721027785-f74eccf877e2"),
  testImage("photo-1540575467063-178a50c2df87"),
  testImage("photo-1505373877841-8d25f7d46678"),
];

export const events: ChlpsEvent[] = [
  {
    id: "retail-risk-asset-protection-masterclass",
    title: "Retail Risk & Asset Protection Masterclass",
    description:
      "An applied masterclass exploring retail risk, asset protection and practical approaches to reducing preventable loss.",
    category: "Masterclass",
    status: "live",
    access: "paid",
    date: "07 Sep 2026",
    time: "10:00 AM",
    duration: "1 Day",
    location: "Ottawa, Canada",
    address: "245 Maplecrest Avenue\nOttawa, Ontario K2P 1L4\nCanada",
    ticketPrice: "CA$95",
    image: meetingGallery[0],
    imageAlt:
      "Professionals collaborating around a table during a loss prevention masterclass",
    gallery: meetingGallery,
  },
  {
    id: "loss-prevention-leadership-forum",
    title: "Loss Prevention Leadership Forum",
    description:
      "A live professional forum focused on leadership, operational resilience and practical approaches to modern loss prevention.",
    category: "Professional Forum",
    status: "live",
    access: "free",
    date: "07 Sep 2026",
    time: "12:00 PM",
    duration: "2 Hours",
    location: "Online",
    ticketPrice: "Free",
    image: virtualGallery[0],
    imageAlt:
      "A professional joining a live virtual loss prevention leadership forum",
    gallery: virtualGallery,
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
    time: "11:00 AM",
    duration: "90 Minutes",
    location: "Online",
    ticketPrice: "Free",
    image: virtualGallery[1],
    imageAlt:
      "Loss prevention professionals reviewing operations together on a tablet",
    gallery: virtualGallery,
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
    time: "09:00 AM",
    duration: "1 Day",
    location: "Ottawa, Canada",
    address: "245 Maplecrest Avenue\nOttawa, Ontario K2P 1L4\nCanada",
    ticketPrice: "CA$95",
    image: meetingGallery[1],
    imageAlt:
      "A loss prevention professional standing in a collaborative office meeting",
    gallery: meetingGallery,
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
    time: "09:30 AM",
    duration: "2 Days",
    location: "Windsor, Canada",
    address: "120 Riverside Drive\nWindsor, Ontario N9A 5K6\nCanada",
    ticketPrice: "CA$95",
    image: conferenceGallery[0],
    imageAlt:
      "A speaker presenting to professionals at a loss prevention conference",
    gallery: conferenceGallery,
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
    time: "01:00 PM",
    duration: "2 Hours",
    location: "Online",
    ticketPrice: "Free",
    image: virtualGallery[2],
    imageAlt:
      "Professionals in conversation at a CHLPS career development event",
    imageClassName: "object-cover object-[right_center]",
    gallery: virtualGallery,
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
    time: "09:00 AM",
    duration: "1 Day",
    location: "Toronto, Canada",
    address: "88 Queens Quay West\nToronto, Ontario M5J 2T8\nCanada",
    ticketPrice: "CA$95",
    image: meetingGallery[2],
    imageAlt: "CHLPS professionals standing together after a workshop session",
    gallery: meetingGallery,
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
    time: "12:00 PM",
    duration: "2 Hours",
    location: "Online",
    ticketPrice: "Free",
    image: virtualGallery[0],
    imageAlt:
      "Security and loss prevention professionals gathered for a forum discussion",
    gallery: virtualGallery,
  },
];

export function getEventsByStatus(status: EventStatus) {
  return events.filter((event) => event.status === status);
}

export function getEventById(id: string) {
  return events.find((event) => event.id === id);
}
