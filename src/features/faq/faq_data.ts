export type PublicFaq = {
  id: string;
  question: string;
  answer: string;
  order?: number;
};

/**
 * Fallback FAQs shown only when the backend returns no published items
 * (e.g. nothing seeded yet, or a transient API failure).
 */
export const FALLBACK_FAQS: PublicFaq[] = [
  {
    id: "faq-1",
    question: "What is ChLPS Canada?",
    answer:
      "The Association of Chartered Loss Prevention Specialists of Canada, ChLPS Canada, is a national professional body dedicated to advancing Loss Prevention through professional standards, education, certification, ethical practice, continuing professional development, and industry collaboration.",
  },
  {
    id: "faq-2",
    question: "Who can become a member of ChLPS Canada?",
    answer:
      "Membership is open to students, emerging practitioners, experienced professionals, managers, executives, consultants, educators, and organizations working in Loss Prevention, asset protection, corporate security, investigations, retail security, supply chain security, risk management, and related fields.",
  },
  {
    id: "faq-3",
    question: "What membership grades are available?",
    answer:
      "ChLPS Canada offers progressive membership grades designed to support individuals throughout their professional journey. These include Student Membership, Affiliate Membership, Licentiate Membership, Associate Membership, Certified Membership, and Corporate Membership for eligible organizations.",
  },
  {
    id: "faq-4",
    question: "What are the benefits of becoming a member?",
    answer:
      "Members benefit from professional recognition, continuing professional development, industry resources, networking opportunities, career support, certification pathways, preferential rates on eligible programs, professional events, and opportunities to contribute to the advancement of the Loss Prevention profession.",
  },
  {
    id: "faq-5",
    question: "What professional certifications does ChLPS Canada offer?",
    answer:
      "ChLPS Canada provides a progressive professional certification pathway comprising CLPA™ Certified Loss Prevention Associate, CLPO™ Certified Loss Prevention Officer, CLPM™ Certified Loss Prevention Manager, and ChLPS™ Chartered Loss Prevention Specialist, supporting development from foundational competence through advanced and chartered professional recognition.",
  },
  {
    id: "faq-6",
    question:
      "What is the difference between membership and professional certification?",
    answer:
      "Membership provides affiliation with the Association and access to applicable member benefits. Professional certification is a formal recognition of demonstrated knowledge, competence, experience, and other prescribed requirements associated with a specific ChLPS Canada professional designation.",
  },
  {
    id: "faq-7",
    question: "Do I need Loss Prevention experience to join ChLPS Canada?",
    answer:
      "Not necessarily. ChLPS Canada provides membership opportunities for different career stages. Students and individuals entering the profession can begin at an appropriate membership grade, while experienced practitioners can pursue membership and certification pathways aligned with their qualifications and professional experience.",
  },
  {
    id: "faq-8",
    question:
      "Does ChLPS Canada provide continuing professional development opportunities?",
    answer:
      "Yes. ChLPS Canada supports lifelong professional development through education, training, webinars, professional resources, knowledge sharing, industry engagement, and other learning opportunities designed to keep practitioners informed about evolving risks, technologies, standards, and professional practices.",
  },
  {
    id: "faq-9",
    question: "Can organizations become members of ChLPS Canada?",
    answer:
      "Yes. Corporate Membership enables eligible organizations to engage with ChLPS Canada, strengthen workforce capability, support employee certification and professional development, access applicable member benefits, participate in industry initiatives, and demonstrate commitment to professional Loss Prevention standards.",
  },
  {
    id: "faq-10",
    question: "How do I join ChLPS Canada or apply for certification?",
    answer:
      "Applicants should select the membership grade or professional certification that best reflects their education, experience, competence, and career stage. They must then complete the applicable application, assessment, examination, professional development, and ethical requirements prescribed by ChLPS Canada for that membership grade or designation.",
  },
];
