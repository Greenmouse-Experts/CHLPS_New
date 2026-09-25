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
  static ordersPreview = "/orders/preview";
  static ordersCreate = "/orders/create";
  static ordersConfirm(thirdPartyRef: string) {
    return `/orders/confirm/${thirdPartyRef}`;
  }
  static ordersCancel(orderNumber: string) {
    return `/orders/cancel-order/${orderNumber}`;
  }
  static ordersTransaction(id: string) {
    return `/orders/fetch-trx/${id}`;
  }
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

  // Course and Membership Applications / Screening
  static courseApplicationSubmit = "/course-applications/submit";
  static myCourseApplication(courseId: string) {
    return `/course-applications/mine/${courseId}`;
  }
  static myCourseApplications = "/course-applications/mine";
  static membershipApplicationSubmit = "/membership-applications/submit";
  static myMembershipApplication(membershipId: string) {
    return `/membership-applications/mine/${membershipId}`;
  }
  static myMembershipApplications = "/membership-applications/mine";

  // Student Memberships
  static studentMembershipsByStudent(studentId: string) {
    return `/student-memberships/student/${studentId}`;
  }
  static myStudentMemberships = "/student-memberships/mine";

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

  static publicPrograms = "/programs/public";
  static publicProgram(id: string) {
    return `/programs/public/${id}`;
  }
  static fetchPrograms = "/programs/fetch-programs";
  static publicCourses = "/courses/public";
  static publicMemberships = "/memberships/public";
  static publicMembership(slug: string) {
    return `/memberships/public/${slug}`;
  }
  static publicEvents = "/events/public";
  static publicEvent(slug: string) {
    return `/events/public/slug/${slug}`;
  }
  static publicEventCategories = "/event-categories/public";

  // Event Registrations & Payment
  static eventRegister(eventId: string) {
    return `/event-registrations/${eventId}/register`;
  }
  static eventJoin(eventId: string) {
    return `/event-registrations/${eventId}/join`;
  }
  static eventInvitationAccept(token: string) {
    return `/event-registrations/invitation/${token}/accept`;
  }
  static eventConfirm(thirdPartyRef: string) {
    return `/event-registrations/confirm/${thirdPartyRef}`;
  }
  static myEventRegistrations = "/event-registrations/my";
  static myEventRegistration(registrationId: string) {
    return `/event-registrations/my/${registrationId}`;
  }
  static cancelEventRegistration(registrationId: string) {
    return `/event-registrations/my/${registrationId}/cancel`;
  }

  static faqsPublished = "/faqs/published";
  static publicTestimonialsCurated = "/testimonials/curated";
  static publicTestimonialsPublished = "/testimonials/published";
  static contactMe = "/contact-me";

  static viewPosts = "/blog/view-posts";
  static viewPost(id: string) {
    return `/blog/view-post/${id}`;
  }
  static viewTags = "/blog/view-tags";
}
