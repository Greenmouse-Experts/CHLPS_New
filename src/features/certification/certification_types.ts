import { Assets } from "@/lib/assets";

export const certificationIds = [
  "clpa",
  "clpo",
  "clpm",
  "chlps",
  "bclp",
  "aclpm",
] as const;

export type CertificationId = (typeof certificationIds)[number];

export type CertificationProgramme = {
  id: CertificationId;
  level: string;
  title: string;
  image: string;
  fee: string;
  feeDetail: string;
  href: string;
};

export const certificationProgrammes: CertificationProgramme[] = [
  {
    id: "clpa",
    level: "Foundation Level",
    title: "CLPA – Certified Loss Prevention Associate",
    image: Assets.images.certificates.clpa,
    fee: "$100",
    feeDetail:
      "$100.00 now and then $100.00 after 1 Year.\nMembership expires after 1 Year.",
    href: "/dashboard/register",
  },
  {
    id: "clpo",
    level: "Intermediate Level",
    title: "CLPO – Certified Loss Prevention Officer",
    image: Assets.images.certificates.clpo,
    fee: "$100",
    feeDetail:
      "$100.00 now and then $100.00 after 1 Year.\nMembership expires after 1 Year.",
    href: "/dashboard/register",
  },
  {
    id: "clpm",
    level: "Advanced Level",
    title: "CLPM – Certified Loss Prevention Manager",
    image: Assets.images.certificates.clpm,
    fee: "$100",
    feeDetail:
      "$100.00 now and then $100.00 after 1 Year.\nMembership expires after 1 Year.",
    href: "/dashboard/register",
  },
  {
    id: "chlps",
    level: "Executive Level",
    title: "ChLPS – Chartered Loss Prevention Specialist",
    image: Assets.images.certificates.chlps,
    fee: "$100",
    feeDetail:
      "$100.00 now and then $100.00 after 1 Year.\nMembership expires after 1 Year.",
    href: "/dashboard/register",
  },
  {
    id: "bclp",
    level: "Basic Certificate",
    title: "Basic Professional Certificate in Loss Prevention",
    image: Assets.images.certificates.bclp,
    fee: "$100",
    feeDetail:
      "$100.00 now and then $100.00 after 1 Year.\nMembership expires after 1 Year.",
    href: "/dashboard/register",
  },
  {
    id: "aclpm",
    level: "Advanced Certificate",
    title: "Advanced Professional Certificate in Loss Prevention Management",
    image: Assets.images.certificates.acipm,
    fee: "$100",
    feeDetail:
      "$100.00 now and then $100.00 after 1 Year.\nMembership expires after 1 Year.",
    href: "/dashboard/register",
  },
];
