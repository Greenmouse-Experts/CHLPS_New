"use client";

import { DashboardLayout, EmptyState, Pagination } from "@/components";
import { Button } from "@/components/ui";
import { usePurchasedCourses } from "@/features/courses/domain/data/hooks/courses_hooks";
import { PurchaseItem } from "@/features/courses/domain/data/response/courses_response";
import Link from "next/link";

const ProgressPage = () => {
  const { isLoading, items, count, page, setPage } = usePurchasedCourses();

  return (
    <DashboardLayout title="Progress">
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton h-40 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-sand bg-white">
          <EmptyState
            title="No progress to show yet"
            description="Enroll in a course to start tracking your completion and assessments here."
          />
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item) => (
              <ProgressCard key={item.id} item={item} />
            ))}
          </div>
          <Pagination page={page} count={count} onPageChange={setPage} />
        </>
      )}
    </DashboardLayout>
  );
};

function ProgressCard({ item }: { item: PurchaseItem }) {
  const { course } = item;
  const total = course.assessment?.total ?? 0;
  const done = course.assessment?.done ?? 0;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = percent === 100;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-sand bg-white sm:flex-row">
      <div className="h-48 w-full shrink-0 bg-cream sm:h-auto sm:w-56">
        {course.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.coverImage} alt={course.title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <h2 className="text-lg font-medium text-primary">{course.title}</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-primary">Completed</span>
            <span className="font-semibold text-[#166534]">{percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-[#38CB89] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-sand pt-4">
          <span className="font-medium text-primary">Assessments</span>
          <span className="font-semibold text-text/70">
            {done}/{total}
          </span>
        </div>
        <div className="mt-auto flex flex-wrap justify-end gap-3 pt-2">
          <Button variant="outline" disabled={!isComplete}>
            Get certification
          </Button>
          <Link href={`/dashboard/courses/${course.id}`}>
            <Button>View course</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
