"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Modal } from "@/components/ui";
import { EmptyState } from "@/components";
import CoursesRepository from "../domain/repository/courses_repository";
import { ReviewItem } from "../domain/data/response/courses_response";

export default function CourseReviews({ courseId }: { courseId: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    const repo = new CoursesRepository();
    const res = await repo.getReviews(courseId);
    if (res.success && res.data) {
      setReviews(res.data.results);
      setAvg(Number(res.data.avgRating) || 0);
      setCount(res.data.count);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [courseId]);

  async function submit() {
    if (rating < 1) {
      toast.error("Please select a rating");
      return;
    }
    setSaving(true);
    const repo = new CoursesRepository();
    const res = await repo.createReview(courseId, rating, comment);
    setSaving(false);
    if (res.success) {
      toast.success(res.message);
      setOpen(false);
      setComment("");
      setRating(0);
      load();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-primary">Course reviews</h3>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Add review
        </Button>
      </div>

      {loading ? (
        <div className="skeleton h-24 rounded-lg" />
      ) : (
        <>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-semibold text-primary">{avg.toFixed(1)}</span>
            <p className="text-sm text-text/55">
              {count} review{count !== 1 ? "s" : ""}
            </p>
          </div>
          {reviews.length === 0 ? (
            <EmptyState title="There are no reviews for this course yet." />
          ) : (
            <ul className="divide-y divide-sand">
              {reviews.map((review) => {
                const name =
                  [review.user?.firstName, review.user?.lastName]
                    .filter(Boolean)
                    .join(" ") || "Anonymous";
                return (
                  <li key={review.id} className="py-4">
                    <p className="font-medium text-primary">{name}</p>
                    <p className="text-sm text-secondary">
                      {Array.from({ length: 5 })
                        .map((_, index) => (index < Math.round(Number(review.rating) || 0) ? "★" : "☆"))
                        .join("")}
                    </p>
                    {review.comment && (
                      <p className="mt-1.5 leading-relaxed text-text/65">{review.comment}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add a review">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Rating</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  className={`text-2xl ${rating >= index + 1 ? "text-secondary" : "text-sand"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience with this course…"
            className="w-full rounded-lg border border-sand p-3 text-text placeholder:text-text/40 focus:border-primary/40 focus:outline-none"
          />
          <Button fullWidth loading={saving} onClick={submit}>
            Submit review
          </Button>
        </div>
      </Modal>
    </div>
  );
}
