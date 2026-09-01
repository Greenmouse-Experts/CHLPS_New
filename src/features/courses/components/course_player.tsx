"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon,
  PlaySquareIcon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import CoursesRepository from "../domain/repository/courses_repository";
import { LessonSub } from "../domain/data/response/courses_response";

export default function CoursePlayer({
  courseId,
  lesson,
  onCompleted,
}: {
  courseId: string;
  lesson: LessonSub | null;
  onCompleted: () => void;
}) {
  const repo = new CoursesRepository();
  const stageRef = useRef<HTMLDivElement>(null);

  async function markRead() {
    if (!lesson) return;
    const res = await repo.recordRead(courseId, lesson.id);
    if (res.success) {
      toast.success(res.message);
      onCompleted();
    } else {
      toast.error(res.message);
    }
  }

  if (!lesson) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-primary/10 text-center text-text/50">
        <HugeiconsIcon icon={PlaySquareIcon} size={40} color="currentColor" />
        <p>Select a lesson to begin</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={stageRef}
        className="relative aspect-video w-full overflow-hidden bg-black"
      >
        <Media lesson={lesson} onEnded={markRead} />
      </div>
      <div className="flex items-center justify-between gap-4 px-1 py-3">
        <h2 className="font-medium text-primary">{lesson.title}</h2>
        {lesson.duration > 0 && (
          <span className="shrink-0 text-sm text-text/45">
            {lesson.duration} Min(s)
          </span>
        )}
      </div>
    </div>
  );
}

function Media({
  lesson,
  onEnded,
}: {
  lesson: LessonSub;
  onEnded: () => void;
}) {
  if (lesson.mediaType === "video") {
    return (
      <video
        src={lesson.media}
        controls
        controlsList="nodownload"
        onEnded={onEnded}
        className="h-full w-full"
      />
    );
  }

  if (lesson.mediaType === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={lesson.media} alt="" className="h-full w-full object-contain" />
    );
  }

  if (lesson.mediaType === "document") {
    return <DocumentMedia src={lesson.media} />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-cream text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lilac text-primary">
        <HugeiconsIcon icon={Task01Icon} size={32} color="currentColor" />
      </span>
      <p className="text-text/70">This lesson is an assessment.</p>
    </div>
  );
}

function DocumentMedia({ src }: { src: string }) {
  if (/\.pdf($|\?)/i.test(src)) {
    return (
      <iframe
        src={`${src.split("#")[0]}#toolbar=0&navpanes=0`}
        title="Document"
        className="h-full w-full bg-white"
      />
    );
  }

  const officeSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`;
  return <iframe src={officeSrc} title="Document" className="h-full w-full bg-white" />;
}

export function MediaIcon({ type }: { type: string }) {
  const icon =
    type === "video" ? PlaySquareIcon : type === "assessment" ? Task01Icon : File01Icon;
  return <HugeiconsIcon icon={icon} size={16} color="currentColor" />;
}
