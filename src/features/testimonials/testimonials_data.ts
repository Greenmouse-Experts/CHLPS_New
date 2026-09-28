export interface MemberTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  organization?: string;
  location?: string;
  rating: number;
  avatar: string;
  initials: string;
}

/**
 * Fallback testimonials matching published member testimonies.
 */
export const FALLBACK_TESTIMONIALS: MemberTestimonial[] = [
  {
    id: "2905d4eb-bc56-4367-aef2-9f6438c9cc42",
    quote:
      "“ChLPS Canada is a trusted and credible professional association. The certification programs are rigorous, relevant, and aligned with today’s industry needs. Being part of ChLPS Canada has expanded my network and created valuable career opportunities.”",
    name: "Priya S. Mehta",
    role: "Senior Loss Prevention Analyst",
    organization: "E-commerce & Logistics Manitoba",
    location: "Canada",
    rating: 5,
    avatar:
      "https://pub-65289ca0758840a892be313f4c7c1ae3.r2.dev/images/438c66db-506d-4662-87c3-97571449aa9a.png",
    initials: "PM",
  },
  {
    id: "b1f3cd73-588e-4b28-b15b-c133cc3c87ac",
    quote:
      "“The CLPO program with ChLPS Canada provided me with the knowledge, tools, and practical skills I needed to excel in my role. The learning experience was exceptional, and the community of professionals is supportive and inspiring.”",
    name: "Jonathan P. Clarke",
    role: "Security & Loss Prevention Manager",
    organization: "Hospitality & Gaming Quebec",
    location: "Canada",
    rating: 5,
    avatar:
      "https://pub-65289ca0758840a892be313f4c7c1ae3.r2.dev/images/6dd4c979-3021-49aa-89c5-197c62900a7e.png",
    initials: "JC",
  },
  {
    id: "178dc429-eb22-48a2-ab69-283a675605dc",
    quote:
      "“ChLPS Canada has given me the professional recognition and confidence to take my career to the next level. The resources, events, and networking opportunities are outstanding and keep me connected with industry best practices across Canada.”",
    name: "Tanya M. Brooks",
    role: "Loss Prevention Specialist",
    organization: "Retail Operations Alberta",
    location: "Canada",
    rating: 5,
    avatar:
      "https://pub-65289ca0758840a892be313f4c7c1ae3.r2.dev/images/1699e585-8c54-4fa5-ac76-ee680d6b7ddb.png",
    initials: "TB",
  },
  {
    id: "df79a2e4-b0fe-4d3f-aa37-66353863240f",
    quote:
      "“Joining ChLPS Canada was one of the best decisions I have made. The certification strengthened my leadership skills, validated my expertise, and opened new career opportunities. ChLPS Canada truly sets the standard for Loss Prevention professionals in Canada.”",
    name: "Mark R. Sullivan",
    role: "Director, Asset Protection",
    organization: "Financial Services Toronto",
    location: "Canada",
    rating: 5,
    avatar:
      "https://pub-65289ca0758840a892be313f4c7c1ae3.r2.dev/images/329d0ddb-68fc-4759-ac56-84bb4ca492e2.png",
    initials: "MS",
  },
  {
    id: "d8395c67-a44a-499c-8b8a-f57dd0754f5c",
    quote:
      "“Earning my CLPM designation through ChLPS Canada significantly enhanced my knowledge, credibility, and career prospects. The program is practical, relevant, and aligned with real-world Loss Prevention challenges. I highly recommend it to any professional serious about advancing in this field.”",
    name: "David O. Adeyemi",
    role: "Regional Loss Prevention Director",
    organization: "Retail & Consumer Services Ontario",
    location: "Canada",
    rating: 5,
    avatar:
      "https://pub-65289ca0758840a892be313f4c7c1ae3.r2.dev/images/d05b1caf-5afd-4a05-b524-b99e5935e00f.png",
    initials: "DA",
  },
  {
    id: "848c3b8a-c735-4b57-bcee-00b2406ddf5f",
    quote:
      "“ChLPS Canada provides more than certification — it offers a supportive professional community, access to industry insights, and continuous learning opportunities. The knowledge and connections I gained have been invaluable in my career development.”",
    name: "Linda K. Tran",
    role: "Loss Prevention Manager",
    organization: "National Retailer British Columbia",
    location: "Canada",
    rating: 4,
    avatar:
      "https://pub-65289ca0758840a892be313f4c7c1ae3.r2.dev/images/f2743b30-8c01-4431-b06d-0fe0da38e108.png",
    initials: "LT",
  },
];
