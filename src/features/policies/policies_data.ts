export const POLICY_TABS = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "cookies", label: "Cookies Policy" },
  { id: "ethics", label: "Practice Standards & Code of Ethics" },
] as const;

export type PolicyTabId = (typeof POLICY_TABS)[number]["id"];

export type PolicySection = {
  title: string;
  body?: string;
  items?: string[];
  after?: string;
};

export type PolicyDocument = {
  id: PolicyTabId;
  badge: string;
  title: string;
  summary: string;
  sections: PolicySection[];
};

export const POLICY_DOCUMENTS: Record<PolicyTabId, PolicyDocument> = {
  terms: {
    id: "terms",
    badge: "Legal",
    title: "Terms & Conditions",
    summary:
      "Terms governing access to and use of the ChLPS Canada website and its professional information, services and content.",
    sections: [
      {
        title: "Association of Chartered Loss Prevention Specialists of Canada",
        body: "By accessing or using the website of the Association of Chartered Loss Prevention Specialists of Canada, you agree to the following Terms of Use. If you do not agree, please discontinue use of the site",
      },
      {
        title: "Use of Website",
        body: "Our website is provided for informational, educational, and professional development purposes. Users must not engage in activities that compromise the security, integrity, or functionality of the site.",
      },
      {
        title: "Intellectual Property",
        body: "All content including text, graphics, logos, course materials, trademarks, and certification marks is the exclusive property of the Association of Chartered Loss Prevention Specialists of Canada, unless otherwise indicated. Users may not copy, download, distribute, reproduce, or modify content without written permission.",
      },
      {
        title: "Accuracy of Information",
        body: "The Association makes reasonable efforts to provide accurate and updated information. We do not guarantee the completeness or suitability of any content. Users rely on information at their own discretion.",
      },
      {
        title: "Membership and Certification",
        body: "Membership and certification information remains subject to the Association's official bylaws, standards and administrative procedures. Requirements, fees and policies may be updated.",
      },
      {
        title: "Prohibited Conduct",
        items: [
          "Unauthorized access to restricted systems",
          "Interference with website performance",
          "Use of the website for unlawful or fraudulent purposes",
          "Uploading harmful or malicious content",
        ],
      },
      {
        title: "Liability, External Links & Termination",
        body: "The Association is not responsible for damages arising from website use, interruptions or reliance on site information. Third-party links are outside the Association's control, and access may be restricted where users breach these terms or compromise site security.",
      },
      {
        title: "Governing Law",
        body: "The Terms are governed by the laws of Canada and the Province of Ontario.",
      },
    ],
  },
  privacy: {
    id: "privacy",
    badge: "Privacy",
    title: "Privacy Policy",
    summary:
      "How ChLPS Canada collects, uses, stores and safeguards personal information for members, applicants, certification holders and website visitors.",
    sections: [
      {
        title: "Association of Chartered Loss Prevention Specialists of Canada",
        body: "The Association of Chartered Loss Prevention Specialists of Canada is committed to protecting the personal information of its members, applicants, certification holders, partners, learners, and visitors to our website. This Privacy Policy explains how we collect, use, store, share, and safeguard your personal information in accordance with the Personal Information Protection and Electronic Documents Act of Canada, the principles of the General Data Protection Regulation, and recognized international privacy standards.",
      },
      {
        title: "Information We Collect",
        body: "We collect only the information necessary to support membership administration, certification services, professional development, communication, and website functionality. This includes:",
        items: [
          "Contact information such as name, address, email, and telephone",
          "Membership and certification information such as applications, renewal records, CPD submissions, and declarations",
          "Payment information processed securely through approved third-party payment providers",
          "Website usage data including IP address, browser type, cookies, and analytics",
          "Voluntary information such as survey responses or uploaded documents",
        ],
        after:
          "We do not collect more information than is required for legitimate organizational purposes.",
      },
      {
        title: "How We Use Personal Information",
        body: "Personal information is used to:",
        items: [
          "Administer membership and certification programs",
          "Verify identity and eligibility for certification",
          "Maintain accurate records for CPD and professional standing",
          "Communicate updates, notices, training opportunities, and compliance requirements",
          "Improve website performance and user experience",
          "Meet legal and regulatory obligations",
          "Protect the integrity of the profession and the safety of the public",
        ],
        after: "We do not sell or commercialize personal information.",
      },
      {
        title: "Legal Basis for Processing",
        body: "We process personal information under the following lawful bases:",
        items: [
          "Consent",
          "Performance of a contract",
          "Compliance with legal obligations",
          "Legitimate organizational interests such as credential verification, fraud prevention, and professional regulation",
        ],
      },
      {
        title: "Data Storage and Retention",
        body: "Personal information is stored securely in Canada or in trusted international data centres that comply with equivalent privacy protections. Retention periods depend on membership and certification status and legal requirements. Records are retained only as long as necessary.",
      },
      {
        title: "Sharing of Personal Information",
        body: "We may share information with:",
        items: [
          "Payment service providers",
          "Learning management system providers",
          "Accreditation bodies",
          "Government or regulatory authorities when legally required",
        ],
        after: "We do not share personal information with unrelated third parties.",
      },
      {
        title: "Your Privacy Rights",
        body: "Subject to applicable law, individuals have the right to:",
        items: [
          "Access their personal information",
          "Request correction or updates",
          "Withdraw consent",
          "Request deletion when appropriate",
          "Restrict or object to processing",
          "Request information on data handling practices",
        ],
        after: "To exercise these rights, email info@chlpscanada.ca.",
      },
      {
        title: "Data Security",
        body: "We use administrative, technical, and organizational safeguards consistent with ISO 27001 and recognized cybersecurity practices to prevent unauthorized access, disclosure, loss, or misuse.",
      },
      {
        title: "Updates to the Policy",
        body: "We may update this Privacy Policy periodically to reflect operational or legal changes.",
      },
    ],
  },
  cookies: {
    id: "cookies",
    badge: "Cookies",
    title: "Cookies Policy",
    summary:
      "How the ChLPS Canada website uses cookies and similar technologies to support functionality, measure performance and improve your experience.",
    sections: [
      {
        title: "Association of Chartered Loss Prevention Specialists of Canada",
        body: "This Cookies Policy explains how our website uses cookies and similar technologies to improve functionality, analyze performance, and personalize user experience.",
      },
      {
        title: "What Cookies Are",
        body: "Cookies are small text files stored on your device when you visit a website. They help websites function correctly and provide a tailored experience.",
      },
      {
        title: "Essential Cookies",
        body: "Enable core functions such as page navigation, secure login, and payment processing.",
      },
      {
        title: "Performance Cookies",
        body: "Collect anonymous data to help us understand how visitors use the website and identify areas for improvement.",
      },
      {
        title: "Functionality Cookies",
        body: "Remember user preferences and improve usability.",
      },
      {
        title: "Analytics and Measurement Cookies",
        body: "Support aggregated insights on usage patterns. Examples include Google Analytics or similar tools.",
        after: "We do not use cookies for targeted advertising.",
      },
      {
        title: "Managing Cookies",
        body: "Most web browsers allow you to accept, refuse, or delete cookies. Restricting cookies may affect website performance.",
      },
      {
        title: "Consent",
        body: "By using our website, you consent to our use of cookies in accordance with this policy. A cookie banner provides options for managing permissions.",
      },
    ],
  },
  ethics: {
    id: "ethics",
    badge: "Ethics",
    title: "Practice Standards & Code of Ethics",
    summary:
      "Professional standards and ethical obligations that guide the conduct of ChLPS Canada members and certification holders.",
    sections: [
      {
        title: "Association of Chartered Loss Prevention Specialists of Canada",
        body: "The Association of Chartered Loss Prevention Specialists of Canada establishes the following Practice Standards and Code of Ethics to guide the conduct of members and certification holders. These standards reflect global expectations of professionalism and align with the principles found in ISO 31000, ISO 18788, ISO 27001, ISO 28000, and recognized international ethics frameworks within the security and risk management profession.",
      },
      {
        title: "Professional Competence",
        body: "Members must maintain a high level of professional knowledge and technical skill. They are responsible for pursuing continuous professional development and applying current standards, methodologies, and best practices in all aspects of their work.",
      },
      {
        title: "Integrity and Honesty",
        body: "Members are expected to conduct themselves with integrity, truthfulness, and transparency. They must avoid conflicts of interest, refrain from deceptive behaviour, and ensure their actions reflect positively on the profession and the Association.",
      },
      {
        title: "Confidentiality",
        body: "Members must safeguard all sensitive and privileged information entrusted to them. Access and disclosure are permitted only when legally required or when explicitly authorized.",
      },
      {
        title: "Respect for Persons",
        body: "Members must treat clients, colleagues, partners, and the public with fairness, dignity, and respect. Harassment, discrimination, intimidation, and abusive behaviour are strictly prohibited.",
      },
      {
        title: "Protection of Assets and Organizational Interests",
        body: "Members must promote the protection of people, property, information, and organizational value through evidence informed risk management and loss prevention practices. Decisions must support safety, continuity of operations, and responsible stewardship of resources.",
      },
      {
        title: "Compliance with Law and Standards",
        body: "Members must comply with all applicable laws, regulations, and professional standards, including those related to security operations, investigations, privacy, and ethical conduct. Members must also uphold the policies and standards established by the Association.",
      },
      {
        title: "Maintenance of Required Licences",
        body: "Members who work in jurisdictions where security officer or private investigator licensing is required must maintain all relevant and valid licenses as a condition of membership and professional practice. Members agree to comply with local regulatory obligations and must notify the Association promptly if their license is suspended, revoked, or otherwise affected.",
      },
      {
        title: "Duty to Report Misconduct",
        body: "Members must report unethical behaviour, serious breaches of security, or actions that compromise public safety or professional integrity. Reports must be made in good faith and through appropriate channels.",
      },
      {
        title: "Accountability",
        body: "Members accept responsibility for their decisions and professional conduct. They must ensure that documentation, reports, and representations are accurate and truthful. They must also cooperate with any legitimate inquiry or review conducted by the Association or relevant authorities.",
      },
      {
        title: "Commitment to Public Safety and Community Well Being",
        body: "Members recognize their professional duty to support a safe and secure society. Their conduct and decisions must reflect awareness of public interest, community impact, and the long-term implications of their work.",
      },
    ],
  },
};

const TAB_ALIASES: Record<string, PolicyTabId> = {
  terms: "terms",
  term: "terms",
  conditions: "terms",
  "terms-and-conditions": "terms",
  privacy: "privacy",
  cookies: "cookies",
  cookie: "cookies",
  ethics: "ethics",
  standards: "ethics",
  practice: "ethics",
  "practice-standards": "ethics",
  "code-of-ethics": "ethics",
};

export function parsePolicyTab(value?: string | null): PolicyTabId {
  if (!value) return "terms";
  return TAB_ALIASES[value.trim().toLowerCase()] ?? "terms";
}
