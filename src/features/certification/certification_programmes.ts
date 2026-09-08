import { Assets } from "@/lib/assets";

export const certificationProgrammes = [
  {
    id: "clpa",
    abbr: "CLPA",
    level: "Foundation Level",
    title: "CLPA – Certified Loss Prevention Associate",
    image: Assets.images.certificates.clpa,
  },
  {
    id: "clpo",
    abbr: "CLPO",
    level: "Intermediate Level",
    title: "CLPO – Certified Loss Prevention Officer",
    image: Assets.images.certificates.clpo,
  },
  {
    id: "clpm",
    abbr: "CLPM",
    level: "Advanced Level",
    title: "CLPM – Certified Loss Prevention Manager",
    image: Assets.images.certificates.clpm,
  },
  {
    id: "chlps",
    abbr: "ChLPS",
    level: "Executive Level",
    title: "ChLPS – Chartered Loss Prevention Specialist",
    image: Assets.images.certificates.chlps,
  },
  {
    id: "bclp",
    abbr: "BCLP",
    level: "Basic Certificate",
    title: "Basic Professional Certificate in Loss Prevention",
    image: Assets.images.certificates.bclp,
  },
  {
    id: "aclpm",
    abbr: "ACLPM",
    level: "Advanced Certificate",
    title: "Advanced Professional Certificate in Loss Prevention Management",
    image: Assets.images.certificates.acipm,
  },
] as const;

export type CertificationProgramme = (typeof certificationProgrammes)[number];
