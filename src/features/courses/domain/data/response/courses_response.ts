import { ApiResponse } from "@/lib/network/entity/api_response";

export type CourseContentMediaType =
  | "video"
  | "image"
  | "document"
  | "assessment";

export interface Course {
  id: string;
  title: string;
  shortDesc?: string;
  fullDesc?: string;
  coverImage?: string;
  totalContent?: number;
  completedContent?: number;
  assessment?: { total: number; done: number };
  program?: { id: string; title: string };
}

export interface PurchaseItem {
  id: string;
  status?: string;
  course: Course;
}

export interface LessonSub {
  id: string;
  title: string;
  duration: number;
  media: string;
  previewUrl?: string | null;
  mediaType: CourseContentMediaType;
}

export interface LessonSection {
  title: string;
  courseContentSubs: LessonSub[];
}

export interface CourseLearnResponse {
  course: Course;
  contents: {
    data: LessonSection[];
    total: number;
    totalDuration: number;
  };
  reads: { id: string; contentSub?: LessonSub }[];
  assessmentResults: {
    score: number;
    total: number;
    percent: number;
    courseContentSub?: LessonSub;
  }[];
}

export interface CourseProgress {
  courseId: string;
  totalContent: number;
  completedContent: number;
  totalAssessments: number;
  completedAssessments: number;
  progress: number;
  isCompleted: boolean;
}

export interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  point: number;
}

export interface AttemptAnswer {
  id: string;
  choice: number;
  assessmentQuestion: {
    question: string;
    options: string[];
    correctOption: number;
    point: number;
  };
}

export interface AttemptResponse {
  result: { score: number; total: number; percent: number };
  attempt: AttemptAnswer[];
}

export interface ReviewItem {
  id: string;
  rating: number | string;
  comment: string;
  user?: {
    firstName?: string;
    lastName?: string;
    picture?: string;
  };
  createdDate?: string;
}

export interface ReviewsData {
  results: ReviewItem[];
  totalRating?: string;
  avgRating?: string;
}

export interface Paged<T> {
  items: T[];
  count: number;
}

export type PurchaseListResponse = ApiResponse<Paged<PurchaseItem>>;
export type CourseLearnApiResponse = ApiResponse<CourseLearnResponse>;
export type CourseProgressApiResponse = ApiResponse<CourseProgress>;
