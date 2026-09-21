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
 * Fallback testimonials shown only when the backend returns no published
 * items (e.g. nothing created yet, or a transient API failure).
 */
export const FALLBACK_TESTIMONIALS: MemberTestimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "“Earning my CLPM designation through ChLPS Canada significantly enhanced my knowledge, credibility, and career prospects. The program is practical, relevant, and aligned with real-world Loss Prevention challenges. I highly recommend it to any professional serious about advancing in this field.”",
    name: "David O. Adeyemi",
    role: "Regional Loss Prevention Director",
    organization: "Retail & Consumer Services",
    location: "Ontario, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=260&h=260&q=80",
    initials: "DA",
  },
  {
    id: "testimonial-2",
    quote:
      "“ChLPS Canada provides more than certification — it offers a supportive professional community, access to industry insights, and continuous learning opportunities. The knowledge and connections I gained have been invaluable in my career development.”",
    name: "Linda K. Tran",
    role: "Loss Prevention Manager",
    organization: "National Retailer",
    location: "British Columbia, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=260&h=260&q=80",
    initials: "LT",
  },
  {
    id: "testimonial-3",
    quote:
      "“Joining ChLPS Canada was one of the best decisions I have made. The certification strengthened my leadership skills, validated my expertise, and opened new career opportunities. ChLPS Canada truly sets the standard for Loss Prevention professionals in Canada.”",
    name: "Mark R. Sullivan",
    role: "Director, Asset Protection",
    organization: "Financial Services",
    location: "Toronto, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=260&h=260&q=80",
    initials: "MS",
  },
  {
    id: "testimonial-4",
    quote:
      "“ChLPS Canada has given me the professional recognition and confidence to take my career to the next level. The resources, events, and networking opportunities are outstanding and keep me connected with industry best practices across Canada.”",
    name: "Tanya M. Brooks",
    role: "Loss Prevention Specialist",
    organization: "Retail Operations",
    location: "Alberta, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=260&h=260&q=80",
    initials: "TB",
  },
  {
    id: "testimonial-5",
    quote:
      "“The CLPO program with ChLPS Canada provided me with the knowledge, tools, and practical skills I needed to excel in my role. The learning experience was exceptional, and the community of professionals is supportive and inspiring.”",
    name: "Jonathan P. Clarke",
    role: "Security & Loss Prevention Manager",
    organization: "Hospitality & Gaming",
    location: "Quebec, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=260&h=260&q=80",
    initials: "JC",
  },
  {
    id: "testimonial-6",
    quote:
      "“ChLPS Canada is a trusted and credible professional association. The certification programs are rigorous, relevant, and aligned with today’s industry needs. Being part of ChLPS Canada has expanded my network and created valuable career opportunities.”",
    name: "Priya S. Mehta",
    role: "Senior Loss Prevention Analyst",
    organization: "E-commerce & Logistics",
    location: "Manitoba, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=260&h=260&q=80",
    initials: "PM",
  },
];
