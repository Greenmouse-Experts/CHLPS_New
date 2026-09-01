export class ApiUrls {
  static login = "/auth/signin";
  static signup = "/user/client/signup";
  static profile = "/auth/profile";
  static refresh = "/auth/refresh";
  static verifyEmail = "/auth/verify-email";
  static resetPasswordRequest = "/auth/reset-password-request";
  static resetPassword = "/auth/reset-password";
  static updateProfile = "/auth/update-profile";
  static updatePassword = "/auth/update-password";
  static uploadImage = "/upload/image";

  static analytics = "/orders/analytics";
  static activityTimeline = "/orders/activity-timeline";
  static purchasedCourses = "/orders/purchased-courses";
  static studentTransactions = "/orders/fetch-student-trx";
  static fetchCourse(id: string) {
    return `/orders/fetch-course/${id}`;
  }
  static courseProgress(id: string) {
    return `/orders/course-progress/${id}`;
  }
  static recordCourseRead = "/orders/record-course-read";
  static assessmentQuestions(id: string) {
    return `/orders/assessment-questions/${id}`;
  }
  static attempt = "/orders/attempt";
  static fetchAttempts(id: string) {
    return `/orders/fetch-attempts/${id}`;
  }

  static courseReviews(id: string) {
    return `/reviews/fetch-course-reviews/${id}`;
  }
  static createCourseReview = "/reviews/create-course-review";

  static generateCertificate = "/certificates/generate";
  static certificateJobStatus(jobId: string) {
    return `/certificates/generate/${jobId}/status`;
  }

  static notificationsUnread = "/notifications/unread";
  static notificationsRead = "/notifications/read";
  static markAllNotificationsRead = "/notifications/mark-all-as-read";
  static markNotificationRead(id: string) {
    return `/notifications/mark-as-read/${id}`;
  }

  static faqsPublished = "/faqs/published";
  static contactMe = "/contact-me";
}
