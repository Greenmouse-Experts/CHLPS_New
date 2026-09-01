"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  Clock01Icon,
  LeftToRightListBulletIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button, Modal } from "@/components/ui";
import { useCourseLearn } from "../domain/data/hooks/courses_hooks";
import CoursesRepository from "../domain/repository/courses_repository";
import { LessonSub } from "../domain/data/response/courses_response";
import CoursePlayer from "../components/course_player";
import CourseContentList from "../components/course_content_list";
import CourseReviews from "../components/course_reviews";

const CourseLearnPage = ({ id }: { id: string }) => {
  const { isLoading, course, progress, refetch } = useCourseLearn(id);
  const [lesson, setLesson] = useState<LessonSub | null>(null);
  const [tab, setTab] = useState<"about" | "reviews">("about");
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const readIds = useMemo(
    () =>
      new Set(
        (course?.reads ?? []).flatMap((item) =>
          item?.contentSub?.id ? [item.contentSub.id] : [],
        ),
      ),
    [course?.reads],
  );

  const doneIds = useMemo(
    () =>
      new Set(
        (course?.assessmentResults ?? []).flatMap((item) =>
          item?.courseContentSub?.id ? [item.courseContentSub.id] : [],
        ),
      ),
    [course?.assessmentResults],
  );

  const firstLesson = useMemo<LessonSub | undefined>(
    () => course?.contents.data.flatMap((section) => section.courseContentSubs).find(Boolean),
    [course],
  );

  const current = lesson ?? firstLesson ?? null;
  const isCompleted = progress?.isCompleted ?? false;

  async function generateCertificate() {
    if (generating || !isCompleted) return;
    setGenerating(true);
    const repo = new CoursesRepository();
    const res = await repo.generateCertificate(id);
    if (!res.success) {
      toast.error(res.message);
      setGenerating(false);
      return;
    }
    if (res.data?.certificateUrl) {
      setCertUrl(res.data.certificateUrl);
      toast.success(res.message);
      setGenerating(false);
      return;
    }
    if (res.data?.jobId) {
      const poll = async (jobId: string) => {
        const status = await repo.getCertificateJob(jobId);
        if (status.data?.status === "completed" && status.data.certificate) {
          setCertUrl(status.data.certificate.certificateUrl);
          setGenerating(false);
          toast.success("Certificate ready");
          return;
        }
        if (status.data?.status === "failed") {
          setGenerating(false);
          toast.error(status.data.error || "Certificate generation failed");
          return;
        }
        setTimeout(() => poll(jobId), 5000);
      };
      poll(res.data.jobId);
      return;
    }
    setGenerating(false);
  }

  if (isLoading || !course) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-10 w-48 rounded" />
        <div className="skeleton aspect-video rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/courses" className="text-sm font-medium text-primary hover:underline">
          ← My Courses
        </Link>
        <Button
          size="sm"
          loading={generating}
          disabled={!isCompleted}
          leftIcon={<HugeiconsIcon icon={Award01Icon} size={16} color="currentColor" />}
          onClick={generateCertificate}
          title={!isCompleted ? "Complete the course to unlock your certificate" : undefined}
        >
          Get certificate
        </Button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="overflow-hidden rounded-xl border border-sand bg-white">
            <CoursePlayer
              courseId={String(course.course.id)}
              lesson={current}
              onCompleted={refetch}
            />
          </div>

          <div className="rounded-xl border border-sand bg-white">
            <div className="flex gap-6 border-b border-sand px-6">
              {(["about", "reviews"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`-mb-px border-b-2 py-3 font-medium capitalize ${
                    tab === item
                      ? "border-secondary text-secondary"
                      : "border-transparent text-text/55"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="p-6">
              {tab === "about" ? (
                <div className="flex gap-5">
                  {course.course.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.course.coverImage}
                      alt={course.course.title}
                      className="hidden h-20 w-28 shrink-0 rounded-md object-cover sm:block"
                    />
                  )}
                  <div className="min-w-0 space-y-2">
                    <h1 className="text-lg font-semibold text-primary">
                      {course.course.title}
                    </h1>
                    {course.course.program?.title && (
                      <p className="text-text/60">Program: {course.course.program.title}</p>
                    )}
                    <p className="whitespace-pre-line leading-relaxed text-text/60">
                      {course.course.shortDesc}
                    </p>
                  </div>
                </div>
              ) : (
                <CourseReviews courseId={String(course.course.id)} />
              )}
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 lg:w-96 lg:shrink-0">
          <div className="flex items-center gap-4 rounded-xl border border-sand bg-white px-5 py-4 text-sm text-text/60">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={LeftToRightListBulletIcon} size={16} color="currentColor" />
              {course.contents.total} modules
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Clock01Icon} size={16} color="currentColor" />
              {course.contents.totalDuration} Min(s)
            </span>
          </div>
          <CourseContentList
            sections={course.contents.data}
            readIds={readIds}
            doneIds={doneIds}
            courseId={String(course.course.id)}
            currentId={current?.id}
            onSelect={setLesson}
            onProgress={refetch}
          />
        </div>
      </div>

      <Modal
        open={!!certUrl}
        onClose={() => setCertUrl(null)}
        title="Certificate ready"
      >
        <div className="space-y-4 text-center">
          <p className="text-text/70">Your certificate has been generated.</p>
          {certUrl && (
            <a
              href={certUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 font-medium text-white"
            >
              Open certificate
            </a>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CourseLearnPage;
