"use client";

import Link from "next/link";
import { DashboardLayout, EmptyState, Pagination } from "@/components";
import { Button } from "@/components/ui";
import { usePurchasedCourses } from "../domain/data/hooks/courses_hooks";
import { PurchaseItem } from "../domain/data/response/courses_response";

const CoursesPage = () => {
  const { isLoading, items, count, page, setPage } = usePurchasedCourses();

  return (
    <DashboardLayout title="My Courses">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton h-80 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-sand bg-white">
          <EmptyState
            title="No purchased courses yet"
            description="Browse the catalogue and enroll to start your training."
            action={
              <Link href="/#certification">
                <Button>Explore programs</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <CourseCard key={item.id} item={item} />
            ))}
          </div>
          <Pagination page={page} count={count} onPageChange={setPage} />
        </>
      )}
    </DashboardLayout>
  );
};

function CourseCard({ item }: { item: PurchaseItem }) {
  const total = item.course.totalContent ?? 0;
  const completed = item.course.completedContent ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-52 overflow-hidden bg-cream">
        {item.course.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.course.coverImage}
            alt={item.course.title}
            className="h-full w-full object-contain"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col bg-primary px-6 py-6 text-center">
        <h2 className="mb-4 line-clamp-2 text-lg font-bold leading-snug text-white">
          {item.course.title}
        </h2>
        <div className="mb-6 space-y-1.5">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-secondary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {total > 0 && (
            <p className="text-sm text-white/40">
              {completed} of {total} lessons completed
            </p>
          )}
        </div>
        <Link
          href={`/dashboard/courses/${item.course.id}`}
          className="mt-auto inline-flex h-11 items-center justify-center rounded-xl bg-secondary text-base font-semibold text-primary hover:brightness-95"
        >
          {completed === 0 ? "Start study" : "Continue study"}
        </Link>
      </div>
    </div>
  );
}

export default CoursesPage;
