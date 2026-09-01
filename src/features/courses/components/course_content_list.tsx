"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  CheckmarkSquare02Icon,
  SquareIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { cn } from "@/lib/tokens";
import { Modal } from "@/components/ui";
import CoursesRepository from "../domain/repository/courses_repository";
import {
  LessonSection,
  LessonSub,
} from "../domain/data/response/courses_response";
import { MediaIcon } from "./course_player";
import AssessmentRunner from "./assessment_runner";

export default function CourseContentList({
  sections,
  readIds,
  doneIds,
  courseId,
  currentId,
  onSelect,
  onProgress,
}: {
  sections: LessonSection[];
  readIds: Set<string>;
  doneIds: Set<string>;
  courseId: string;
  currentId?: string;
  onSelect: (lesson: LessonSub) => void;
  onProgress: () => void;
}) {
  const firstWithLessons = sections.findIndex(
    (section) => section.courseContentSubs.length > 0,
  );
  const [openIndex, setOpenIndex] = useState(
    firstWithLessons === -1 ? 0 : firstWithLessons,
  );
  const [activeAssessment, setActiveAssessment] = useState<LessonSub | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-sand bg-white">
      <div className="border-b border-sand px-5 py-4">
        <h2 className="font-semibold text-primary">Course content</h2>
      </div>
      <div className="divide-y divide-sand">
        {sections.map((section, index) => (
          <div key={`${section.title}-${index}`}>
            <button
              type="button"
              onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-cream"
            >
              <span className="font-medium text-primary">{section.title}</span>
              <HugeiconsIcon
                icon={openIndex === index ? ArrowUp01Icon : ArrowDown01Icon}
                size={16}
                color="currentColor"
              />
            </button>
            {openIndex === index && section.courseContentSubs.length === 0 && (
              <p className="px-5 pb-4 text-sm text-text/40">
                No lessons in this section yet.
              </p>
            )}
            {openIndex === index && section.courseContentSubs.length > 0 && (
              <ul className="bg-cream/50">
                {section.courseContentSubs.map((sub) =>
                  sub.mediaType === "assessment" ? (
                    <li key={sub.id}>
                      <button
                        type="button"
                        onClick={() => setActiveAssessment(sub)}
                        className="flex w-full items-start gap-3 px-5 py-3 text-left hover:bg-lilac/60"
                      >
                        <LessonCheck done={doneIds.has(sub.id)} />
                        <span className="flex flex-1 items-center gap-2 text-text/80">
                          <MediaIcon type={sub.mediaType} />
                          <span className="flex-1">{sub.title}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-lilac px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary uppercase">
                          {doneIds.has(sub.id) ? "Done" : "Assessment"}
                        </span>
                      </button>
                    </li>
                  ) : (
                    <LessonRow
                      key={sub.id}
                      sub={sub}
                      read={readIds.has(sub.id)}
                      active={currentId === sub.id}
                      courseId={courseId}
                      onSelect={() => onSelect(sub)}
                      onProgress={onProgress}
                    />
                  ),
                )}
              </ul>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={!!activeAssessment}
        onClose={() => setActiveAssessment(null)}
        title="Assessment"
        size="lg"
      >
        {activeAssessment && (
          <AssessmentRunner
            key={activeAssessment.id}
            sub={activeAssessment}
            courseId={courseId}
            done={doneIds.has(activeAssessment.id)}
            onClose={() => setActiveAssessment(null)}
            onProgress={onProgress}
          />
        )}
      </Modal>
    </div>
  );
}

function LessonCheck({ done }: { done: boolean }) {
  return (
    <span className={cn("mt-0.5", done ? "text-secondary" : "text-text/30")}>
      <HugeiconsIcon
        icon={done ? CheckmarkSquare02Icon : SquareIcon}
        size={16}
        color="currentColor"
      />
    </span>
  );
}

function LessonRow({
  sub,
  read,
  active,
  courseId,
  onSelect,
  onProgress,
}: {
  sub: LessonSub;
  read: boolean;
  active: boolean;
  courseId: string;
  onSelect: () => void;
  onProgress: () => void;
}) {
  const [pending, setPending] = useState(false);

  async function markRead() {
    if (read || pending) return;
    setPending(true);
    const repo = new CoursesRepository();
    const res = await repo.recordRead(courseId, sub.id);
    setPending(false);
    if (res.success) {
      toast.success(res.message);
      onProgress();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <li className={cn("flex items-start gap-3 px-5 py-3", active && "bg-lilac/70")}>
      <button
        type="button"
        onClick={markRead}
        disabled={read || pending}
        aria-label={read ? "Completed" : "Mark as completed"}
        className="mt-0.5 text-secondary disabled:cursor-default"
      >
        <LessonCheck done={read} />
      </button>
      <button
        type="button"
        onClick={() => {
          onSelect();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex flex-1 items-center gap-2 text-left"
      >
        <MediaIcon type={sub.mediaType} />
        <span className={cn("flex-1", active ? "font-medium text-primary" : "text-text/80")}>
          {sub.title}
        </span>
      </button>
      {sub.duration > 0 && (
        <span className="mt-0.5 shrink-0 text-xs text-text/40">{sub.duration} Min(s)</span>
      )}
    </li>
  );
}
