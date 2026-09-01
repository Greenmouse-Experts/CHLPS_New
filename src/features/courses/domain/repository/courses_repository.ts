import { AxiosRequestHeaders } from "axios";
import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { fail, ok } from "@/lib/network/entity/api_response";
import { unwrapEntity, unwrapList, unwrapMessage, unwrapPaged } from "@/lib/tokens";
import {
  AttemptResponse,
  CourseLearnApiResponse,
  CourseLearnResponse,
  CourseProgress,
  CourseProgressApiResponse,
  PurchaseItem,
  PurchaseListResponse,
  QuestionItem,
  ReviewItem,
  ReviewsData,
} from "../data/response/courses_response";

function courseHeaders(courseId: string) {
  return { "Course-Request-Id": courseId } as unknown as AxiosRequestHeaders;
}

class CoursesRepository {
  private _api = new ApiService();

  public async getPurchasedCourses(
    page = 1,
    status = "confirmed",
  ): Promise<PurchaseListResponse> {
    const res = await this._api.getData<unknown>(ApiUrls.purchasedCourses, {
      page,
      status,
    });
    if (res.success) {
      return ok(unwrapPaged<PurchaseItem>(res.data));
    }
    return fail(res.message || "Failed to load courses");
  }

  public async getCourse(id: string): Promise<CourseLearnApiResponse> {
    const res = await this._api.getData<unknown>(ApiUrls.fetchCourse(id));
    if (res.success && res.data) {
      const data = unwrapEntity<CourseLearnResponse>(res.data);
      if (data?.course) return ok(data);
    }
    return fail(res.message || "Failed to load course");
  }

  public async getProgress(id: string): Promise<CourseProgressApiResponse> {
    const res = await this._api.getData<unknown>(ApiUrls.courseProgress(id));
    if (res.success && res.data) {
      const data = unwrapEntity<CourseProgress>(res.data);
      if (data) return ok(data);
    }
    return fail(res.message || "Failed to load progress");
  }

  public async recordRead(courseId: string, lessonId: string) {
    const res = await this._api.postData<
      { courseContentSub: string },
      { message?: string }
    >(
      ApiUrls.recordCourseRead,
      { courseContentSub: lessonId },
      courseHeaders(courseId),
    );
    return {
      success: res.success,
      message: unwrapMessage(
        res.data,
        res.message || (res.success ? "Lesson completed." : "Could not update progress."),
      ),
    };
  }

  public async getQuestions(courseId: string, lessonId: string) {
    const res = await this._api.getData<unknown>(
      ApiUrls.assessmentQuestions(lessonId),
      undefined,
      courseHeaders(courseId),
    );
    if (res.success) {
      return ok(unwrapList<QuestionItem>(res.data));
    }
    return fail(res.message || "Failed to load questions");
  }

  public async submitAttempt(
    courseId: string,
    lessonId: string,
    attempt: { question: string; choice: number }[],
  ) {
    const res = await this._api.postData<
      { attempt: { question: string; choice: number }[]; courseContentSub: string },
      { message?: string }
    >(
      ApiUrls.attempt,
      { attempt, courseContentSub: lessonId },
      courseHeaders(courseId),
    );
    return {
      success: res.success,
      message: unwrapMessage(
        res.data,
        res.message || (res.success ? "Submitted" : "Could not submit answers."),
      ),
    };
  }

  public async getAttempt(courseId: string, lessonId: string) {
    const res = await this._api.getData<unknown>(
      ApiUrls.fetchAttempts(lessonId),
      undefined,
      courseHeaders(courseId),
    );
    if (res.success && res.data) {
      const data = unwrapEntity<AttemptResponse>(res.data);
      if (data) return ok(data);
    }
    return fail(res.message || "Could not load this attempt.");
  }

  public async getReviews(courseId: string) {
    const res = await this._api.getData<unknown>(ApiUrls.courseReviews(courseId));
    if (res.success) {
      const nested = unwrapEntity<ReviewsData>(res.data);
      return ok({
        results: nested?.results ?? unwrapList<ReviewItem>(res.data),
        avgRating: nested?.avgRating ?? "0",
        count: unwrapPaged(res.data).count,
      });
    }
    return fail(res.message || "Failed to load reviews");
  }

  public async createReview(courseId: string, rating: number, comment: string) {
    const res = await this._api.postData<
      { rating: number; comment: string; item: string },
      { message?: string }
    >(ApiUrls.createCourseReview, { rating, comment, item: courseId });
    return {
      success: res.success,
      message: unwrapMessage(
        res.data,
        res.message || (res.success ? "Review submitted." : "Could not submit review."),
      ),
    };
  }

  public async generateCertificate(courseId: string) {
    const res = await this._api.postData<
      { courseId: string },
      {
        message?: string;
        data?: {
          jobId?: string;
          certificateId?: string;
          certificateNumber?: string;
          certificateUrl?: string;
          issuedAt?: string;
        };
      }
    >(ApiUrls.generateCertificate, { courseId });
    if (res.success) {
      return ok(res.data?.data ?? null, unwrapMessage(res.data, "Certificate requested"));
    }
    return fail(res.message || "Could not generate certificate");
  }

  public async getCertificateJob(jobId: string) {
    const res = await this._api.getData<{
      data?: {
        status: "completed" | "processing" | "failed";
        progress?: number;
        error?: string;
        certificate?: {
          certificateId: string;
          certificateNumber: string;
          certificateUrl: string;
          issuedAt: string;
        };
      };
    }>(ApiUrls.certificateJobStatus(jobId));
    if (res.success) return ok(res.data?.data ?? null);
    return fail(res.message || "Could not check certificate status");
  }
}

export default CoursesRepository;
