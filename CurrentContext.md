# Current Context & Project Status (CHLPS_New)

> **Last Updated**: 2026-09-16  
> **Environment**: Next.js 16.2.10 (Turbopack), Tailwind CSS, DaisyUI, TanStack React Query v5, Stripe SDK (`@stripe/stripe-js`, `@stripe/react-stripe-js`), Redux Toolkit, Axios.

---

## 1. Project Overview & Business Rules

### API Endpoints & Auth

- **Base URL**: `https://chlps-backend.onrender.com/api/v1`
- **Auth Scheme**: Bearer token via `Authorization: Bearer <token>`.
- **User Token in State**: Hydrated from Redux `state.user.token` or local storage cookies.
- **Test Auth Credentials** (`auth_token.ts` - gitignored):
  - **Email**: `greenmousetest@gmail.com`
  - **Role**: `student`
  - **User ID**: `9216edbc-7c20-4236-aa64-96bdb8d687ef`

### Strict Payment & Order Flow Rules

1. **Rule 1: Always Call `POST /orders/preview` Before `POST /orders/create`**
   - Payload:
     ```json
     {
       "amount": 790,
       "courses": [{ "id": "uuid", "price": 790 }],
       "memberships": []
     }
     ```
   - Returns:
     ```json
     {
       "statusCode": 200,
       "message": "Order preview",
       "data": {
         "subAmount": 790,
         "taxAmount": 102.7,
         "taxRate": 13,
         "total": 892.7
       }
     }
     ```
2. **Rule 2: The `amount` Field in `POST /orders/create` MUST Be `subAmount` (Item Subtotal Sum)**
   - Do **NOT** pass `total` (with taxes) as the `amount` to `POST /orders/create`. The backend validates that `amount === sum(course.price + membership.price)`. The backend calculates and appends the 13% tax internally before forwarding to Stripe.
3. **Rule 3: Questionnaire / Pre-Screening Prerequisite Before Order Creation**
   - If a course has `applicationQuestions`, `POST /orders/create` requires `applicationId` inside the course payload item:
     ```json
     {
       "courses": [
         {
           "id": "35a48394-142b-424e-8033-65628c19d94a",
           "price": 790,
           "applicationId": "0910c187-7b90-4726-bec8-bf144a1d6b2b"
         }
       ]
     }
     ```
   - Pre-Screening Endpoints:
     - `GET /api/v1/course-applications/mine/:courseId`: Returns existing application object or 200 null if not attempted.
     - `POST /api/v1/course-applications/submit`:
       ```json
       {
         "courseId": "35a48394-142b-424e-8033-65628c19d94a",
         "answers": [
           {
             "questionId": "6af5ac18-6c95-493c-8fed-781c5d1c213a",
             "answer": true
           }
         ]
       }
       ```

---

## 2. Enrollment & Assessment Flow Architecture

### Flow Implementation

1. **Enroll Button Click** (Both on `/certification` cards and `/certification/[id]` details):
   - If user is not authenticated: Redirects to `/dashboard/sign-in?redirect=...`.
   - If course has no `applicationQuestions`: Opens `StripePaymentModal` directly.
   - If course has `applicationQuestions`:
     - Checks attempts via `orderService.fetchMyCourseApplication(course.id)`.
     - If completed attempt exists (`app.id` present): Opens `StripePaymentModal` directly with `applicationId`.
     - If no attempts or not completed: Navigates to `/certification/[id]/assessment`.

2. **Assessment Page (`/certification/[id]/assessment`)**:
   - Route: `src/app/certification/[id]/assessment/page.tsx`
   - Component: `CertificationAssessmentPage` (`src/features/certification/pages/certification_assessment_page.tsx`)
   - Checks if attempt already completed:
     - Shows completed banner and button to "Proceed to Payment" (which opens `StripePaymentModal`).
   - If not completed:
     - Renders questions with Yes / No toggle buttons.
     - Submits questionnaire to `POST /course-applications/submit`.
     - On completion, immediately launches `StripePaymentModal` with the received `applicationId`.

---

## 3. Git Workflow & Production Checks

- **Typecheck**: `bun run typecheck` (Passes with 0 errors)
- **Production Build**: `bun run build` (All 31 static/dynamic routes generated cleanly)
- **Active Branches**: `dev` and `main`
