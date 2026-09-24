"use client";

import { useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Image as ImageIcon,
  Play,
  ClipboardList,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import simpleApiClient from "@/lib/network/simpleApi";
import QueryCompLayout from "@/components/QueryCompLayout";
import Modal, { type ModalHandle } from "@/components/DialogModal";
import type {
  CourseContentSection,
  CourseContentSub,
  CourseProgramSingle,
} from "@/types/courses";
import PreviewMedia from "./PreviewMedia";
import HeaderText from "@/components/HeaderText";
import PageContainer from "@/features/components/page_container";

interface CurriculumProps {
  id?: string;
  sections?: CourseContentSection[];
}

export default function Curriculum({ id, sections = [] }: CurriculumProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [preview, setPreview] = useState<CourseContentSub | null>(null);
  const modalRef = useRef<ModalHandle>(null);

  const query = useQuery<CourseProgramSingle>({
    queryKey: ["course-content", id],
    queryFn: async () => {
      const resp = await simpleApiClient.get(`/course-content/public/${id}`);
      return resp.data;
    },
    enabled: Boolean(id),
  });

  function openPreview(sub: CourseContentSub) {
    setPreview(sub);
    modalRef.current?.open();
  }

  return (
    <>
      <section id="curriculum" className="scroll-mt-24 bg-[#FAF9F5] py-8 ">
        <PageContainer className="mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col items-center justify-center text-center">
            <HeaderText left="CERTIFICATION" right="CURRICULUM" />
          </div>

          {/* Curriculum Accordion List */}
          <div className="mt-4">
            {id ? (
              <QueryCompLayout
                query={query}
                loadingText="Loading curriculum..."
              >
                {(data: CourseProgramSingle) => (
                  <AccordionList
                    sections={data.contents?.data ?? []}
                    openIndex={openIndex}
                    onToggle={(index) =>
                      setOpenIndex((cur) => (cur === index ? null : index))
                    }
                    onPreview={openPreview}
                  />
                )}
              </QueryCompLayout>
            ) : (
              <AccordionList
                sections={sections}
                openIndex={openIndex}
                onToggle={(index) =>
                  setOpenIndex((cur) => (cur === index ? null : index))
                }
                onPreview={openPreview}
              />
            )}
          </div>
        </PageContainer>
      </section>

      <Modal
        ref={modalRef}
        title={preview?.title ?? "Lesson Preview"}
        maxWidth="max-w-4xl"
      >
        {preview && <PreviewMedia sub={preview} />}
      </Modal>
    </>
  );
}

interface AccordionListProps {
  sections: CourseContentSection[];
  openIndex: number | null;
  onToggle: (index: number) => void;
  onPreview: (sub: CourseContentSub) => void;
}

function AccordionList({
  sections,
  openIndex,
  onToggle,
  onPreview,
}: AccordionListProps) {
  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-[#CDA54E]/25 bg-white p-12 text-center shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E1758]/5 text-[#1E1758]">
          <BookOpen className="h-6 w-6 text-[#1E1758]" />
        </span>
        <h3 className="text-lg font-bold text-[#1E1758]">
          No curriculum available yet
        </h3>
        <p className="max-w-md  text-[#7A778B]">
          The curriculum for this program is being finalized. Check back soon or
          contact us for the detailed outline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <SectionAccordion
          key={section.title || index}
          number={String(index + 1).padStart(2, "0")}
          section={section}
          isOpen={openIndex === index}
          onToggle={() => onToggle(index)}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}

interface SectionAccordionProps {
  number: string;
  section: CourseContentSection;
  isOpen: boolean;
  onToggle: () => void;
  onPreview: (sub: CourseContentSub) => void;
}

function SectionAccordion({
  number,
  section,
  isOpen,
  onToggle,
  onPreview,
}: SectionAccordionProps) {
  const subs = section.courseContentSubs || [];

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#CDA54E]/35 bg-white transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(30,23,88,0.04)] sm:rounded-[22px]">
      {/* Header Row */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors sm:px-6 sm:py-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
          {/* Number Pill Badge */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E1758]  font-bold text-white shadow-sm sm:h-8.5 sm:w-8.5">
            {number}
          </span>

          {/* Module Title */}
          <h3 className="truncate text-[14.5px] font-semibold text-[#1E1758] sm:text-[15.5px]">
            {section.title}
          </h3>
        </div>

        {/* Chevron Icon */}
        <span className="flex shrink-0 items-center justify-center text-[#1E1758]">
          <ChevronDown
            className={`h-4 w-4 text-[#1E1758] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Expanded Lessons */}
      {isOpen && subs.length > 0 && (
        <ul className="divide-y divide-[#F2EFE8] border-t border-[#F2EFE8]">
          {subs.map((sub: CourseContentSub, subIndex: number) => (
            <SubItem
              key={sub.id || sub.title || subIndex}
              sub={sub}
              onPreview={onPreview}
            />
          ))}
        </ul>
      )}
    </article>
  );
}

function SubItem({
  sub,
  onPreview,
}: {
  sub: CourseContentSub;
  onPreview: (sub: CourseContentSub) => void;
}) {
  const durationText =
    typeof sub.duration === "number" && sub.duration > 0
      ? `${sub.duration}m`
      : "2m";

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7 sm:py-4.5">
      {/* Left: Icon + Lesson Title */}
      <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
        <span className="shrink-0 text-[#8E8B9E]">
          <MediaIcon type={sub.mediaType} />
        </span>
        <span className="truncate  font-normal text-[#5A576D] sm:text-[14.5px]">
          {sub.title}
        </span>
      </div>

      {/* Right: Duration + Preview Button */}
      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <span className="flex items-center gap-1.5  font-medium text-[#7C798D] sm:">
          <Clock className="h-3.5 w-3.5 text-[#8E8B9E]" />
          {durationText}
        </span>

        <button
          type="button"
          onClick={() => onPreview(sub)}
          className="flex items-center gap-1.5 rounded-[8px] border border-[#1E1758] px-3.5 py-1.5  font-semibold text-[#1E1758] transition-all duration-150 hover:bg-[#1E1758] hover:text-white cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Preview</span>
        </button>
      </div>
    </li>
  );
}

function MediaIcon({ type }: { type: CourseContentSub["mediaType"] }) {
  const cls = "h-4 w-4 shrink-0 text-[#8E8B9E]";
  if (type === "video") return <Play className={cls} />;
  if (type === "image") return <ImageIcon className={cls} />;
  if (type === "assessment") return <ClipboardList className={cls} />;
  return <FileText className={cls} />;
}
