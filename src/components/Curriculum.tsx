import { useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Image,
  Play,
  ClipboardList,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "#/client/api.ts";
import QueryCompLayout from "#/components/layout/QueryCompLayout.tsx";
import Modal, { type ModalHandle } from "#/components/modals/DialogModal.tsx";
import type {
  CourseContentSection,
  CourseContentSub,
  CourseProgramSingle,
} from "#/types/courses.ts";
import PreviewMedia from "./PreviewMedia";

interface CurriculumProps {
  id?: string;
  sections?: CourseContentSection[];
}

export default function Curriculum({ id, sections = [] }: CurriculumProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const [preview, setPreview] = useState<CourseContentSub | null>(null);
  const modalRef = useRef<ModalHandle>(null);

  const query = useQuery<CourseProgramSingle>({
    queryKey: ["course-content", id],
    queryFn: async () => {
      const resp = await apiClient.get(`/course-content/public/${id}`);
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
      <section
        id="curriculum"
        className="scroll-mt-24  px-6 md:px-16 pb-8 bg-base-200 py-12 border-t-primary border-t "
      >
        <h2 className="container mx-auto">
          <div className="text-lg  text-accent uppercase  w-fit  bg-white py-2 ring-current/40 px-7 rounded-full  ring self-start shadow font-bold">
            Program <span className="text-primary">Curriculum</span>
          </div>
        </h2>
        <div className="container mx-auto mt-12">
          {id ? (
            <QueryCompLayout query={query} loadingText="Loading curriculum...">
              {(data) => (
                <AccordionList
                  sections={data.contents?.data ?? []}
                  openIndex={openIndex}
                  onToggle={(index) =>
                    setOpenIndex((cur) => (cur === index ? -1 : index))
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
                setOpenIndex((cur) => (cur === index ? -1 : index))
              }
              onPreview={openPreview}
            />
          )}
        </div>
      </section>

      <Modal ref={modalRef} title={preview?.title}>
        {preview?.previewUrl && <PreviewMedia sub={preview} />}
      </Modal>
    </>
  );
}

interface AccordionListProps {
  sections: CourseContentSection[];
  openIndex: number;
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
      <div className="flex flex-col items-center justify-center gap-4 border-b border-base-300 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-base-200">
          <BookOpen className="h-6 w-6 text-base-content/40" />
        </span>
        <h3 className="text-xl font-medium text-accent">
          No curriculum available yet
        </h3>
        <p className="max-w-md leading-relaxed text-base-content/55">
          The curriculum for this program is being finalized. Check back soon or
          contact admissions for the full breakdown.
        </p>
      </div>
    );
  }

  return (
    <>
      {sections.map((section, index) => (
        <SectionAccordion
          key={section.title}
          number={String(index + 1).padStart(2, "0")}
          section={section}
          sectionIndex={index}
          isOpen={openIndex === index}
          onToggle={() => onToggle(index)}
          onPreview={onPreview}
        />
      ))}
    </>
  );
}

interface SectionAccordionProps {
  number: string;
  section: CourseContentSection;
  sectionIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  onPreview: (sub: CourseContentSub) => void;
}

function SectionAccordion({
  number,
  section,
  sectionIndex,
  isOpen,
  onToggle,
  onPreview,
}: SectionAccordionProps) {
  return (
    <div className="border-b border-base-300 py-6 md:py-8">
      <div className="flex items-start gap-3 md:gap-6">
        <span className="mt-1 font-medium tracking-widest text-base-content md:mt-2 md:text-lg">
          {number}
        </span>

        <button type="button" onClick={onToggle} className="flex-1 text-left">
          <h3 className="text-xl leading-tight font-medium text-accent sm:text-2xl md:text-4xl">
            {section.title}
          </h3>
          <p className="mt-1 text-base md:text-lg">
            {section.courseContentSubs.length} lesson
            {section.courseContentSubs.length !== 1 ? "s" : ""}
          </p>
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse section" : "Expand section"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-base-300 text-base-content hover:border-base-content/30 md:h-11 md:w-11"
        >
          {isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      {isOpen && section.courseContentSubs.length > 0 && (
        <ul className="mt-6 ml-6 divide-y divide-base-300 border-t border-base-300 md:ml-12">
          {section.courseContentSubs.map((sub, lessonIndex) => (
            <SubItem
              key={sub.title}
              sub={sub}
              showPreview={sectionIndex === 0 && lessonIndex < 2}
              onPreview={onPreview}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function SubItem({
  sub,
  showPreview,
  onPreview,
}: {
  sub: CourseContentSub;
  showPreview: boolean;
  onPreview: (sub: CourseContentSub) => void;
}) {
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex flex-1 items-start gap-3 sm:gap-4">
        <span className="mt-1 sm:mt-1.5">
          <MediaIcon type={sub.mediaType} />
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-base md:text-lg">{sub.title}</span>
          {sub.description && (
            <p className="mt-0.5 text-sm text-base-content/55 md:text-base">
              {sub.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pl-7 sm:justify-end sm:pl-0">
        {sub.duration > 0 && (
          <span className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3" />
            {sub.duration}m
          </span>
        )}
        {showPreview && sub.previewUrl && (
          <button
            type="button"
            onClick={() => onPreview(sub)}
            className="btn btn-outline btn-accent items-center gap-2 sm:btn-lg sm:gap-4"
          >
            <Eye className="size-4 sm:size-5" />
            Preview
          </button>
        )}
      </div>
    </li>
  );
}

function MediaIcon({ type }: { type: CourseContentSub["mediaType"] }) {
  const cls = "h-4 w-4 shrink-0 text-base-content/40";
  if (type === "video") return <Play className={cls} />;
  if (type === "image") return <Image className={cls} />;
  if (type === "assessment") return <ClipboardList className={cls} />;
  return <FileText className={cls} />;
}
