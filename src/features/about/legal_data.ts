export interface LegalCardItem {
  id: string;
  titleHighlight: string;
  titleNormal: string;
  titleBreak?: boolean;
  image: string;
  imageAlt: string;
  imageOnLeft: boolean;
  description: string;
}

export const LEGAL_CARDS: LegalCardItem[] = [
  {
    id: "incorporation",
    titleHighlight: "Canada Chartered &",
    titleNormal: "Professional Association",
    titleBreak: true,
    image: "/lega/cert_1.png",
    imageAlt:
      "Canada Chartered & Professional Association Certificate of Incorporation",
    imageOnLeft: true,
    description:
      "The Association of Chartered Loss Prevention Specialists of Canada is federally incorporated under the Canada Not-For-profit Corporations Act (CNCA). As a chartered professional association, we operate within a framework for governance, accountability, legal compliance and requirements set forth by the CNCA. This foundation supports our mission to advance loss prevention (LP) practice through membership, education, certification, and the promotion of ethical standards for LP practitioners across Canada and internationally.",
  },
  {
    id: "cpd-group",
    titleHighlight: "CPD-GROUP",
    titleNormal: "UK APPROVED",
    titleBreak: false,
    image: "/lega/cert_2.png",
    imageAlt: "CPD-GROUP UK Approved Certificate",
    imageOnLeft: false,
    description:
      "The Association of Chartered Loss Prevention Specialists of Canada is a registered CPD Provider with The CPD Group, United Kingdom. This status reflects our commitment to structured continuing professional development and meaningful learning for loss prevention practitioners. Through relevant education, certification pathways, continuing professional education and skills development, we support our members and certifications holders in maintaining competence and responding to the changing demands of their profession.",
  },
  {
    id: "actd-usa",
    titleHighlight: "ACTD-USA",
    titleNormal: "Accreditation",
    titleBreak: false,
    image: "/lega/cert_3.png",
    imageAlt: "ACTD-USA Certificate of Accreditation",
    imageOnLeft: true,
    description:
      "The Association of Chartered Loss Prevention Specialists of Canada is accredited by the American Council of Training and Development (ACTD USA) as a Professional Certification Organization. This accreditation reflects our commitment to high quality, industry relevant loss prevention education, supported by effective learning practices, LP Body of Knowledge, qualified instructors, rigorous professional standards compliance, and operational excellence throughout our training and certification programs, and membership activities.",
  },
  {
    id: "qahe",
    titleHighlight: "QAHE",
    titleNormal: "Accreditation",
    titleBreak: false,
    image: "/lega/cert_4.png",
    imageAlt: "QAHE Institutional Accreditation Certificate",
    imageOnLeft: false,
    description:
      "The Association of Chartered Loss Prevention Specialists of Canada holds institutional accreditation from the International Association for Quality Assurance in Pre-Tertiary and Higher Education (QAHE). This recognition and accreditation reflect our commitment to sound quality assurance, professional standards, and continuous improvement in loss prevention education and certification. We remain dedicated to relevant learning, credible assessment, and meaningful professional development for loss prevention practitioners.",
  },
];
