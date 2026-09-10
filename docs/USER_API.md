# CHLPS User & Student Portal — API Specification & Integration Guide

**Document Version**: 1.0.0  
**Target Audience**: Frontend Engineers, Mobile Developers, QA & Integration Partners  
**Platform**: CHLPS Student Portal & Public Web Platform (`CHLPS_New`)  
**Scope**: Public Catalog, Student Account, LMS Player, Checkout/Orders, Events, Memberships, Certificates & Notifications  
**Reference Collection**: `Chlps Institute API.postman_collection.json` (76 Student & Public-Facing Endpoints)  
**Related Audit**: [ADMIN_API_AUDIT.md](file:///home/destiny/Documents/projects/CHLPS_New/docs/ADMIN_API_AUDIT.md) (Admin Back-Office Scope)

---

## 1. Executive Summary & Architecture Overview

The **CHLPS User & Student API** serves two distinct client contexts:
1. **Public Unauthenticated Visitors**: Exploring courses, programs, membership grades, upcoming events, articles, FAQs, testimonials, and submitting contact inquiries.
2. **Authenticated Students & Members**: Onboarding, enrolling in courses/memberships, engaging with the LMS video player, taking graded assessments, downloading certificates, managing ticketed events, and tracking purchase transactions.

### Key Contrast with Admin API (`ADMIN_API_AUDIT.md`)
Unlike the Admin Portal which governs back-office CMS operations, instructor management, question authoring, template uploads, and revenue reporting, the **User API** is strictly consumer-centric, emphasizing frictionless checkout, low-latency catalog browsing, secure student data isolation, and asynchronous certificate generation.

### Endpoint Distribution Summary

| Category / Domain | Endpoints | Auth Type | Primary Consumers |
| :--- | :---: | :--- | :--- |
| **Authentication & Profile** | 9 | Public / Bearer JWT | Sign Up, Sign In, Profile, Password Reset |
| **Public Catalog & Discovery** | 7 | Public / Optional JWT | Course Grid, Featured Courses, Section Previews |
| **LMS Player & Assessments** | 8 | Bearer JWT (Student) | Purchased Courses, Lesson Progress, Quizzes, Results |
| **Reviews & Ratings** | 3 | Public / Bearer JWT | Course Feedback Submission & Public Reviews |
| **Student Analytics & Timeline** | 3 | Bearer JWT (Student) | Study Hours, Course Status Breakdown, Timeline |
| **Checkout, Orders & Payments** | 6 | Bearer JWT (Student) | Order Preview, Create Order, Verify Payment, History |
| **Certificates & Credentialing** | 5 | Public / Bearer JWT | Generate Async Job, Poll Status, Verify Number |
| **Memberships & Verification** | 6 | Public / Bearer JWT | Grade Discovery, Active Tier, Document Vault |
| **Events & Attendee Ticketing** | 11 | Public / Bearer JWT | Event Discovery, Ticket Booking, Invites, Passes |
| **Programs, Blog & CMS Content** | 8 | Public | Programs Directory, Blog Feed, Tags, Testimonials |
| **Notifications & Alerts** | 5 | Bearer JWT (Student) | Student Feed, Unread Counter, Read Status |
| **Media & File Uploads** | 4 | Public / Form-Data | Avatar Image, Document PDF Uploads |
| **Support & Inquiries** | 2 | Public / Bearer JWT | Contact Form & Direct Inquiries |
| **Total User Endpoints** | **77** | | |

---

## 2. Global Request & Response Conventions

### 2.1 Base URL & Environment Configuration
```env
NEXT_PUBLIC_API_URL=https://api.chlps.org/api/v1
```
All endpoints documented below are prefixed by `/api/v1`.

### 2.2 Standard Response Envelope
All API endpoints return JSON conforming to standard `ApiResponse<T>` wrappers:

```typescript
// Success Response Envelope
interface ApiResponse<T> {
  statusCode: number;      // e.g., 200, 201
  message: string;         // e.g., "Request processed successfully"
  data: T;                 // Result payload
  meta?: {                 // Included in paginated queries
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Error Response Envelope
interface ApiErrorResponse {
  statusCode: number;      // e.g., 400, 401, 403, 404, 500
  message: string | string[];
  error: string;
}
```

### 2.3 Authentication Headers
For authenticated endpoints, include the access token in standard Bearer format:
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

---

## 3. Detailed Endpoint Specification

### 3.1 Authentication & Account Lifecycle

#### 3.1.1 Student Registration (`POST /user/client/signup`)
- **Access**: Public
- **Description**: Registers a new student account.
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "student@example.com",
    "phone": "+2348012345678",
    "password": "StrongPassword123!"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "statusCode": 201,
    "message": "Student account registered successfully. Please verify your email.",
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "John",
      "lastName": "Doe",
      "email": "student@example.com",
      "phone": "+2348012345678",
      "role": "student",
      "isEmailVerified": false,
      "createdAt": "2026-09-01T10:00:00.000Z"
    }
  }
  ```

#### 3.1.2 Student Sign In (`POST /auth/signin`)
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "message": "Sign in successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1Ni...",
      "refreshToken": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "firstName": "John",
        "lastName": "Doe",
        "email": "student@example.com",
        "role": "student",
        "picture": "https://res.cloudinary.com/chlps/avatars/user1.jpg"
      }
    }
  }
  ```

#### 3.1.3 Email Verification (`GET /auth/verify-email`)
- **Access**: Bearer Token or Query Token
- **Query Params**: `token` (string)
- **Response `200 OK`**: `{ "statusCode": 200, "message": "Email verified successfully" }`

#### 3.1.4 Get Profile (`GET /auth/profile`)
- **Access**: Bearer JWT (Student)
- **Response `200 OK`**: Returns current authenticated user record with preferences and enrollments.

#### 3.1.5 Update Profile (`POST /auth/update-profile`)
- **Access**: Bearer JWT (Student)
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+2348012345678",
    "picture": "https://res.cloudinary.com/chlps/image/upload/avatar.jpg",
    "address": "123 Academic Way, Victoria Island, Lagos",
    "bio": "Supply chain & logistics practitioner",
    "facebookUrl": "https://facebook.com/johndoe",
    "twitterUrl": "https://x.com/johndoe",
    "linkedinUrl": "https://linkedin.com/in/johndoe"
  }
  ```

#### 3.1.6 Password Management
- **Request Password Reset (`POST /auth/reset-password-request`)**:
  - Request: `{ "email": "student@example.com" }`
- **Confirm Reset Password (`POST /auth/reset-password`)**:
  - Request: `{ "token": "abc123token", "password": "NewSecurePassword123!" }`
- **Update Password (`POST /auth/update-password`)**:
  - Headers: `Authorization: Bearer <token>`
  - Request:
    ```json
    {
      "oldPassword": "currentPassword123",
      "newPassword": "newPassword123",
      "newPasswordConfirmation": "newPassword123"
    }
    ```
- **Sign Out (`POST /auth/signout`)**:
  - Invalidates current refresh and access token session.

---

### 3.2 Public Course Catalog & Curriculum Discovery

#### 3.2.1 Fetch Public Courses (`GET /courses/public`)
- **Access**: Public
- **Query Params**:
  - `page` (default: 1), `pageSize` (default: 10)
  - `search` (string, filters title/description)
  - `orderBy` (e.g., `createdAt`, `price`, `rating`)
  - `sortOrder` (`ASC` | `DESC`)
- **Response `200 OK`**: Returns paginated courses with instructor summaries, pricing, ratings, and course outcomes.

#### 3.2.2 Fetch Featured Courses (`GET /courses/public/featured`)
- **Access**: Public
- **Description**: Returns curated courses flagged for homepage and showcase carousels.

#### 3.2.3 Fetch Course by Slug (`GET /courses/public/slug/:slug`)
- **Access**: Public
- **Description**: Primary endpoint for SEO course landing pages (`/courses/[slug]`). Includes overview, syllabus modules, requirements, outcomes, instructor bio, and enrolled count.

#### 3.2.4 Fetch Course Preview Section (`GET /course-content/public/slug/:slug` & `GET /course-content/public/:id`)
- **Access**: Public
- **Description**: Retrieves public previewable curriculum modules (syllabus tree, module names, free preview lessons).

---

### 3.3 Student LMS Learning Player & Assessments

```
┌─────────────────────────────────────────────────────────────┐
│                    Student Learning Flow                    │
│                                                             │
│  [Enrolled Courses] ──> [Fetch Content Tree] ──> [Play Sub] │
│          │                                             │    │
│  [Record Read Completion] <────────────────────────────┘    │
│          │                                                  │
│  [Fetch Assessment Qs] ──> [Submit Quiz] ──> [View Results] │
└─────────────────────────────────────────────────────────────┘
```

#### 3.3.1 Fetch Enrolled Courses (`GET /orders/purchased-courses`)
- **Access**: Bearer JWT (Student)
- **Response `200 OK`**: Array of enrolled courses with completion percentage, enrollment date, and last accessed timestamp:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Certified Logistics Professional (CLP)",
        "slug": "certified-logistics-professional",
        "thumbnail": "https://res.cloudinary.com/chlps/course-thumb.jpg",
        "progress": 65,
        "completed": false,
        "totalModules": 12,
        "completedModules": 8,
        "enrolledAt": "2026-08-15T09:30:00Z"
      }
    ]
  }
  ```

#### 3.3.2 Fetch Purchased Course Player Details (`GET /orders/fetch-course/:id`)
- **Access**: Bearer JWT (Student)
- **Description**: Delivers full curriculum content (videos, lesson text, downloadable materials, assessments) for active enrolled students.

#### 3.3.3 Fetch Course Progress (`GET /orders/course-progress/:id`)
- **Access**: Bearer JWT (Student)
- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "completionPercentage": 75,
      "completedItems": [
        "sub-item-uuid-1",
        "sub-item-uuid-2"
      ],
      "nextItem": "sub-item-uuid-3",
      "isEligibleForCertificate": false
    }
  }
  ```

#### 3.3.4 Record Lesson Completion (`POST /orders/record-course-read`)
- **Access**: Bearer JWT (Student)
- **Request Body**:
  ```json
  {
    "courseContentSub": "sub-item-uuid-3"
  }
  ```
- **Response `200 OK`**: Updates completion records and returns refreshed progress metrics.

#### 3.3.5 Assessment Questions (`GET /orders/assessment-questions/:id`)
- **Access**: Bearer JWT (Student)
- **Params**: `:id` = `courseContentSub` ID or assessment module ID.
- **Response `200 OK`**: Returns questions, options, point values, and time limits without exposing answer keys.

#### 3.3.6 Submit Assessment Attempt (`POST /orders/attempt`)
- **Access**: Bearer JWT (Student)
- **Request Body**:
  ```json
  {
    "courseContentSub": "sub-item-uuid-assessment",
    "attempt": [
      {
        "question": "question-uuid-1",
        "choice": 2
      },
      {
        "question": "question-uuid-2",
        "choice": 0
      }
    ]
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "attemptId": "attempt-uuid-99",
      "score": 85.5,
      "passed": true,
      "passingScore": 70,
      "totalQuestions": 20,
      "correctAnswers": 17,
      "submittedAt": "2026-09-02T14:22:00Z"
    }
  }
  ```

#### 3.3.7 Fetch Assessment History & Aggregates
- `GET /orders/fetch-attempts/:id`: Historical attempts for a specific assessment.
- `GET /orders/fetch-assessments-result`: Comprehensive quiz/assessment history across all enrolled courses.

---

### 3.4 Student Analytics & Learning Stream

| Endpoint | Method | Purpose | Key Data Fields |
| :--- | :---: | :--- | :--- |
| `/orders/analytics` | `GET` | High-level dashboard summary | Enrolled courses, Completed courses, Certificates count, Active hours |
| `/orders/activity-timeline` | `GET` | Chronological activity log | Lesson completions, quiz attempts, certificate milestones |
| `/orders/course-status-breakdown` | `GET` | Learning distribution graph | Status counts: `{ notStarted: 1, inProgress: 3, completed: 2 }` |

---

### 3.5 Checkout, Orders & Payment Processing

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Checkout & Payment Flow                         │
│                                                                        │
│  [Cart Items] ──> [POST /orders/preview]  (Calculate totals & discount)│
│                            │                                           │
│                   [POST /orders/create]   (Create pending order)       │
│                            │                                           │
│         [Redirect Gateway (Paystack / Stripe)]                         │
│                            │                                           │
│  [POST /orders/confirm/:thirdPartyRef]    (Verify & grant access)      │
└────────────────────────────────────────────────────────────────────────┘
```

#### 3.5.1 Order Preview (`POST /orders/preview`)
- **Access**: Bearer JWT (Student)
- **Description**: Validates cart items, verifies discount coupons, and returns subtotal, tax, and total.
- **Request Body**:
  ```json
  {
    "amount": 50000,
    "courses": [
      { "id": "course-uuid-1", "price": 25000 }
    ],
    "memberships": [
      {
        "id": "membership-tier-uuid-1",
        "price": 25000,
        "documentId": "document-uuid-verified"
      }
    ]
  }
  ```

#### 3.5.2 Create Order (`POST /orders/create`)
- **Access**: Bearer JWT (Student)
- **Request Body**:
  ```json
  {
    "amount": 50000,
    "callback_url": "https://portal.chlps.org/dashboard/purchase-history?status=verify",
    "courses": [
      { "id": "course-uuid-1", "price": 25000 }
    ],
    "memberships": [
      {
        "id": "membership-tier-uuid-1",
        "price": 25000,
        "documentId": "document-uuid-verified"
      }
    ]
  }
  ```
- **Response `201 Created`**: Returns payment reference, authorization URL (for Paystack / Stripe redirect), and `orderNumber`.

#### 3.5.3 Confirm Order Payment (`POST /orders/confirm/:thirdPartyRef`)
- **Access**: Bearer JWT (Student)
- **Description**: Called on return from payment gateway to verify server-side transaction success and unlock content.

#### 3.5.4 Cancel Pending Order (`POST /orders/cancel-order/:orderNumber`)
- **Access**: Bearer JWT (Student)
- **Description**: Cancels an unfulfilled pending checkout session.

#### 3.5.5 Student Transaction History
- `GET /orders/fetch-student-trx`: List of invoices, receipts, and order statuses.
- `GET /orders/fetch-trx/:id`: Detailed line-item receipt and tax breakdown.

---

### 3.6 Certificates & Credential Verification

#### 3.6.1 Request Certificate Generation (`POST /certificates/generate`)
- **Access**: Bearer JWT (Student)
- **Description**: Initiates asynchronous generation of PDF certificate upon 100% course completion.
- **Request Body**:
  ```json
  {
    "courseId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Response `202 Accepted`**:
  ```json
  {
    "statusCode": 202,
    "message": "Certificate generation queued",
    "data": {
      "jobId": "job-uuid-7712",
      "status": "processing"
    }
  }
  ```

#### 3.6.2 Poll Certificate Job Status (`GET /certificates/generate/:jobId/status`)
- **Access**: Bearer JWT (Student)
- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "jobId": "job-uuid-7712",
      "status": "completed",
      "certificate": {
        "id": "cert-uuid-1",
        "certificateNumber": "CHLPS-CLP-2026-0891",
        "fileUrl": "https://res.cloudinary.com/chlps/certificates/cert-0891.pdf",
        "issuedAt": "2026-09-02T16:00:00Z"
      }
    }
  }
  ```

#### 3.6.3 Public Certificate Verification (`GET /certificates/verify/:certificateNumber`)
- **Access**: Public
- **Description**: Used by employers and regulatory bodies to verify student authenticity.
- **Response `200 OK`**: Returns graduate name, course title, issuance date, credential status (`Active` / `Revoked`).

---

### 3.7 Memberships & Verification Document Vault

#### 3.7.1 Public Membership Tiers (`GET /memberships/public`)
- **Access**: Public
- **Query Params**: `search`, `status`, `currency`, `requiredDocument`
- **Description**: Returns all published membership grades (e.g., Student, Associate, Full Member, Fellow) along with pricing, criteria checklist, and benefits.

#### 3.7.2 Single Membership by Slug (`GET /memberships/public/:slug`)
- **Access**: Public
- **Description**: Returns tier breakdown, including sub-components:
  - `job-opportunities`: Career advantages.
  - `how-membership-helps`: Practical skill advantages.
  - `why-join-now`: Highlights and cards.

#### 3.7.3 Student Enrolled Memberships (`GET /memberships/my-memberships`)
- **Access**: Bearer JWT (Student)
- **Description**: Active membership plan, renewal dates, and status.

#### 3.7.4 Student Document Vault (`/student-documents`)
- **Submit Document (`POST /student-documents/submit`)**:
  - Request:
    ```json
    {
      "documentType": "Passport",
      "fileUrl": "https://res.cloudinary.com/chlps/docs/passport.pdf"
    }
    ```
- **Fetch My Documents (`GET /student-documents`)**: List submitted verification docs with approval states (`pending`, `verified`, `rejected`).
- **Delete Document (`DELETE /student-documents/:id`)**: Remove document if not yet bound to an approved membership.

---

### 3.8 Events & Attendee Ticketing

```
┌──────────────────────────────────────────────────────────────────┐
│                     Event Registration Flow                      │
│                                                                  │
│  [GET /events/public] ──> [Select Event] ──> Paid or Free?      │
│                                                 │                │
│             ┌───────────────────────────────────┴─────────────┐  │
│             ▼                                                 ▼  │
│    [Paid Event]                                         [Free Event]
│   POST .../register                                     POST .../join
│   Confirm Payment (POST .../confirm/:ref)                     │  │
│             │                                                 │  │
│             └────────────────> [Ticket Issued] <──────────────┘  │
│                                [GET .../my/:id]                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.8.1 Public Events Listing (`GET /events/public`)
- **Access**: Public
- **Query Params**: `page`, `pageSize`, `search`, `categoryId`, `format` (`In-Person` | `Virtual` | `Hybrid`), `status` (`Published`), `eligibility`

#### 3.8.2 Event Details by Slug (`GET /events/public/slug/:slug`)
- **Access**: Public
- **Description**: Complete event agenda, keynote speakers, venue/virtual links, and seat availability.

#### 3.8.3 Register for Paid Event (`POST /event-registrations/:eventId/register`)
- **Access**: Bearer JWT (Student)
- **Response `201 Created`**: Returns registration reference and payment redirect metadata.

#### 3.8.4 Instant Join for Free Event (`POST /event-registrations/:eventId/join`)
- **Access**: Bearer JWT (Student)
- **Response `200 OK`**: Directly issues attendance pass and calendar invitation.

#### 3.8.5 Accept Event Invitation (`POST /event-registrations/invitation/:token/accept`)
- **Access**: Bearer JWT (Student)
- **Description**: Consumes an email token sent for VIP/Invited-only conferences.

#### 3.8.6 My Registered Events & Tickets
- `GET /event-registrations/my`: Registered events calendar.
- `GET /event-registrations/my/:registrationId`: Ticket details, access credentials, and pass QR code.
- `POST /event-registrations/my/:registrationId/cancel`: Cancel attendance.
- `GET /event-registrations/invitations/my`: Received event invitations.

---

### 3.9 CMS Content, Social Proof & Inquiries

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/programs/public` | `GET` | Public | Complete directory of degree and diploma programs |
| `/blog/view-posts` | `GET` | Public | Paginated published news articles and industry insights |
| `/blog/view-post/:id` | `GET` | Public | Single article payload with author, tags, and rich content |
| `/blog/view-tags` | `GET` | Public | Published tag cloud for category filtering |
| `/testimonials/published` | `GET` | Public | Published graduate and member success stories |
| `/faqs/published` | `GET` | Public | Public knowledge base grouped by category |
| `/contact-me` | `POST` | Public | Public contact form submission |
| `/user/send-contact-message`| `POST` | Public | General contact inquiry submission |

---

### 3.10 Student Notification Stream

- `GET /notifications/student`: Returns list of notifications targeted to students (enrollment confirmations, quiz grading alerts, certificate readiness).
- `GET /notifications/unread`: Counter and list of unread alerts.
- `GET /notifications/read`: Historical read alerts.
- `PATCH /notifications/mark-as-read/:id`: Marks single alert as read.
- `PATCH /notifications/mark-all-as-read`: Bulk acknowledges all alerts.

---

### 3.11 File & Media Uploads

- `POST /upload/image`: Multipart form-data with file field `image`. Returns CDN image URL for profile avatars.
- `POST /upload/doc`: Multipart form-data with file field `doc`. Returns CDN document URL for KYC verification.

---

## 4. Frontend Integration & Codebase Alignment (`CHLPS_New`)

The frontend application under `src/` maps cleanly to the User API specifications:

### 4.1 Route & Feature Matrix

| Frontend Route | Feature Module | Connected Endpoints |
| :--- | :--- | :--- |
| `/dashboard/sign-in` | `src/features/auth/` | `POST /auth/signin` |
| `/dashboard/register` | `src/features/auth/` | `POST /user/client/signup` |
| `/dashboard/reset-password` | `src/features/auth/` | `POST /auth/reset-password-request`, `POST /auth/reset-password` |
| `/dashboard/settings` | `src/features/dashboard/` | `GET /auth/profile`, `POST /auth/update-profile`, `POST /auth/update-password` |
| `/dashboard` | `src/features/dashboard/` | `GET /orders/analytics`, `GET /orders/activity-timeline`, `GET /orders/course-status-breakdown` |
| `/dashboard/courses` | `src/features/courses/` | `GET /orders/purchased-courses` |
| `/dashboard/courses/[id]` | `src/features/courses/` | `GET /orders/fetch-course/:id`, `GET /orders/course-progress/:id`, `POST /orders/record-course-read`, `POST /orders/attempt` |
| `/dashboard/purchase-history`| `src/features/purchase_history/`| `GET /orders/fetch-student-trx`, `GET /orders/fetch-trx/:id` |
| `/dashboard/notifications` | `src/features/notifications/` | `GET /notifications/student`, `PATCH /notifications/mark-as-read/:id`, `PATCH /notifications/mark-all-as-read` |
| `/dashboard/support` | `src/features/support/` | `POST /contact-me`, `GET /faqs/published` |
| `/events` | `src/features/events/` | `GET /events/public`, `GET /event-categories/public` |
| `/events/[id]` | `src/features/events/` | `GET /events/public/slug/:slug`, `POST /event-registrations/:eventId/register`, `POST /event-registrations/:eventId/join` |
| `/membership` | `src/features/membership/` | `GET /memberships/public`, `GET /memberships/my-memberships` |
| `/membership/[id]` | `src/features/membership/` | `GET /memberships/public/:slug`, `POST /student-documents/submit` |
| `/certification` | `src/features/certification/`| `GET /certificates/my`, `POST /certificates/generate`, `GET /certificates/verify/:certificateNumber` |

### 4.2 Central Network Configuration
All frontend network callers utilize `src/lib/network/api_url.tsx`, which contains the mapped paths:
```typescript
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
```

---

## 5. Security, Validation & Error Handling

1. **Token Storage**:
   - Access tokens are stored in secure memory / encrypted cookies and dispatched via HTTP interceptors.
   - Refresh tokens are handled through secure HTTP-only cookies on `/auth/refresh`.

2. **Idempotency & Race Conditions**:
   - Payment confirmation (`POST /orders/confirm/:thirdPartyRef`) is idempotent; redundant callbacks do not duplicate course enrollments.
   - Assessment submissions (`POST /orders/attempt`) enforce server-side single-active-attempt locks.

3. **Validation Codes**:
   - `400 Bad Request`: Payload validation failed (e.g., malformed email, missing fields).
   - `401 Unauthorized`: Token missing or expired.
   - `403 Forbidden`: Attempting to access course content or assessments without active enrollment.
   - `404 Not Found`: Resource (slug, ID, certificate number) does not exist.
   - `409 Conflict`: Duplicate registration or active attempt already in flight.
