"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import CoursesRepository from "../../repository/courses_repository";
import {
  CourseLearnResponse,
  CourseProgress,
  PurchaseItem,
} from "../response/courses_response";

export function usePurchasedCourses() {
  const repo = new CoursesRepository();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  const fetchCourses = useCallback(async (nextPage: number) => {
    try {
      setIsLoading(true);
      const res = await repo.getPurchasedCourses(nextPage);
      if (res.success && res.data) {
        setItems(res.data.items);
        setCount(res.data.count);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(page);
  }, [page, fetchCourses]);

  return { isLoading, items, count, page, setPage, refetch: () => fetchCourses(page) };
}

export function useCourseLearn(id: string) {
  const repo = new CoursesRepository();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<CourseLearnResponse | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  const fetchCourse = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await repo.getCourse(id);
      if (res.success && res.data) setCourse(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Failed to load course");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchProgress = useCallback(async () => {
    const res = await repo.getProgress(id);
    if (res.success && res.data) setProgress(res.data);
  }, [id]);

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, [fetchCourse, fetchProgress]);

  return {
    isLoading,
    course,
    progress,
    refetch: () => {
      fetchCourse();
      fetchProgress();
    },
  };
}
