# SkillSwap – GitHub Project Backlog (Hierarchical)

Work must proceed strictly in dependency order.

Order:

Infrastructure → Domain Models → Domain Services → Layout & Routing → UI Business Flow → Coverage → Hardening

---

# EPIC P0 – Infrastructure

These tasks establish the technical foundation of the application.

---

## P0.1 – API Configuration

* Create `core/config/api.config.ts`
* Export `API_BASE_URL`

Acceptance Criteria:

* Base URL is centralized
* No hardcoded URLs elsewhere

---

## P0.2 – HTTP Wrapper

* Create `core/http/api-client.ts`
* Implement:

  * get()
  * post()
  * patch()
  * delete()
* Prefix base URL automatically
* Catch HttpErrorResponse
* Normalize errors

Acceptance Criteria:

* All services use api-client
* No direct HttpClient usage in features

---

## P0.3 – ApiError Model & Error Normalization

* Create `core/http/api-error.model.ts`
* Create `core/http/error.util.ts`
* Extract `{ "error": "..." }` safely
* Fallback for unexpected shapes

Acceptance Criteria:

* Backend error messages displayed verbatim
* No unhandled HttpErrorResponse

---

## P0.4 – Authentication Store

* Create `core/auth/auth.store.ts`
* Store token + user
* Persist token in localStorage
* Expose authentication helpers

Acceptance Criteria:

* Token persists across refresh
* isAuthenticated() works correctly

---

## P0.5 – JWT Interceptor

* Create `core/interceptors/auth.interceptor.ts`
* Attach `Authorization: Bearer <token>`
* Handle 401:

  * Clear session
  * Redirect to /login

Acceptance Criteria:

* Protected endpoints include header
* Expired token redirects properly

---

## P0.6 – Auth Guard

* Create `core/guards/auth.guard.ts`
* Protect authenticated routes
* Preserve attempted URL

Acceptance Criteria:

* Unauthenticated access blocked
* Redirect flow works

---

# EPIC P1 – Domain Models

All API data contracts must be defined before services or UI work begins.

---

## P1.1 – User Model

* Create `core/models/user.model.ts`
* Define full user shape according to API
* Mark optional fields correctly

Acceptance Criteria:

* No `any` types
* rating_avg and completed_jobs typed correctly

---

## P1.2 – Job Model

* Create `core/models/job.model.ts`
* Define job structure
* Define status as union:

  * 'open'
  * 'in_progress'
  * 'completed'

Acceptance Criteria:

* Status strictly typed
* Owner and freelancer summaries typed correctly

---

## P1.3 – Proposal Model

* Create `core/models/proposal.model.ts`
* Define proposal structure

Acceptance Criteria:

* price typed as number
* status typed correctly

---

## P1.4 – Review Model

* Create `core/models/review.model.ts`
* Define review structure

Acceptance Criteria:

* rating strictly typed as number
* target_id typed correctly

---

# EPIC P2 – Domain Services (API Mapping Layer)

All backend endpoints must be mapped before UI implementation.

---

## P2.1 – Auth Service

* Implement `auth.service.ts`
* Map:

  * POST /auth/register
  * POST /auth/login

Acceptance Criteria:

* Typed responses
* 409 suggested_username supported
* Errors propagate as ApiError

---

## P2.2 – Users Service

* Map:

  * GET /users/me
  * GET /users/:username

Acceptance Criteria:

* Typed responses
* 404 handled properly

---

## P2.3 – Jobs Service

* Map:

  * POST /jobs/search
  * POST /jobs
  * GET /jobs/:id
  * PATCH /jobs/:id
  * GET /jobs/my-postings
  * PATCH /jobs/:id/complete

Acceptance Criteria:

* All documented errors supported
* Typed request and response bodies

---

## P2.4 – Proposals Service

* Map:

  * POST /jobs/:job_id/proposals
  * GET /jobs/:job_id/proposals
  * PATCH /proposals/:proposal_id/accept
  * GET /proposals/my-bids
  * DELETE /proposals/:proposal_id

Acceptance Criteria:

* 409 pending proposal handled
* 400 invalid state handled
* 403 forbidden handled

---

## P2.5 – Reviews Service

* Map:

  * POST /jobs/:job_id/reviews
  * GET /reviews/user/:user_id

Acceptance Criteria:

* rating validated at type level
* 409 duplicate review handled

---

## P2.6 – Platform Service

* Map:

  * GET /platform/stats

Acceptance Criteria:

* Typed stats model

---

# EPIC P3 – Layout & Routing Skeleton

Routing must be stable before building pages.

---

## P3.1 – Root Layout

* Implement `app.component.html`
* Render header, navbar, router-outlet, footer

Acceptance Criteria:

* Layout renders consistently
* No business logic in layout

---

## P3.2 – Static Navbar

* Implement navigation links only
* No auth state logic yet

Acceptance Criteria:

* Navigation works

---

## P3.3 – Define Route Map

Declare all routes in `app.routes.ts`:

* /login
* /register
* /jobs
* /jobs/create
* /jobs/my-postings
* /jobs/:id
* /jobs/:id/edit
* /proposals/my-bids
* /users/me
* /users/:username
* /platform/stats

Acceptance Criteria:

* All required routes declared
* No missing paths

---

## P3.4 – Guard Integration

* Attach auth.guard to protected routes

Acceptance Criteria:

* Protected routes redirect to /login
* Redirect flow preserved

---

# EPIC P4 – Mandatory Business Flow (UI Layer)

Implements full grading flow end-to-end.

---

## P4.1 – Register Page

## P4.2 – Login Page

## P4.3 – Job Search Page

## P4.4 – Create Job Page

## P4.5 – Job Details Page

## P4.6 – Submit Proposal

## P4.7 – Owner Proposal List

## P4.8 – Complete Job

## P4.9 – Submit Reviews

Each must:

* Use services only
* Display backend errors verbatim
* Manage loading state

---

# EPIC P5 – Completeness & Coverage

## P5.1 – My Profile Page

## P5.2 – Public Profile Page

## P5.3 – My Postings Page

## P5.4 – My Bids Page

## P5.5 – User Reviews Page

## P5.6 – Platform Stats Page

---

# EPIC P6 – UX Hardening

## P6.1 – Global Loading Handling

## P6.2 – Global Error Handling

## P6.3 – Confirmation Enforcement

## P6.4 – Empty State Coverage

## P6.5 – UI Business Rule Enforcement

---

# Definition of Done

* Full mandatory workflow functions without error
* All documented backend errors handled
* JWT handling correct
* No mocked data
* Clean separation of concerns
* Repository structure matches architecture
* Ready for demonstration video
