# SkillSwap – GitHub Project Backlog

Work must proceed in order: P0 → P1 → P2 → P3.

------

# P0 – Infrastructure (Blockers)

These tasks must be completed before feature implementation.

## P0.1 – API Configuration

- Create `core/config/api.config.ts`
- Export `API_BASE_URL`

Acceptance Criteria:

- Base URL is centralized
- No hardcoded URLs elsewhere

------

## P0.2 – HTTP Wrapper

- Create `core/http/api-client.ts`
- Implement:
  - get()
  - post()
  - patch()
  - delete()
- Prefix base URL automatically
- Catch HttpErrorResponse
- Normalize errors

Acceptance Criteria:

- All services use api-client
- No direct HttpClient usage in features

------

## P0.3 – ApiError Model & Error Normalization

- Create `core/http/api-error.model.ts`
- Create `core/http/error.util.ts`
- Extract `{ "error": "..." }` safely
- Fallback for unexpected shapes

Acceptance Criteria:

- Backend error messages displayed verbatim
- No unhandled HttpErrorResponse

------

## P0.4 – Authentication Store

- Create `core/auth/auth.store.ts`
- Store token + user
- Persist token in localStorage
- Expose authentication helpers

Acceptance Criteria:

- Token persists across refresh
- isAuthenticated() works correctly

------

## P0.5 – JWT Interceptor

- Create `core/interceptors/auth.interceptor.ts`
- Attach `Authorization: Bearer <token>`
- Handle 401:
  - Clear session
  - Redirect to /login

Acceptance Criteria:

- Protected endpoints include header
- Expired token redirects properly

------

## P0.6 – Auth Guard

- Create `core/guards/auth.guard.ts`
- Protect authenticated routes
- Preserve attempted URL

Acceptance Criteria:

- Unauthenticated access blocked
- Redirect flow works

------

## P0.7 – Layout & Routing Skeleton

- Implement `app.component.html` layout
- Implement `app.routes.ts`
- Protect routes using auth.guard

Acceptance Criteria:

- All required routes declared
- Layout renders correctly

------

## P0.8 – Shared UI Primitives

Create reusable components:

- alert-error
- alert-success
- spinner
- empty-state
- confirm-dialog
- rating-stars
- field-error
- form-error-summary

Acceptance Criteria:

- All pages can display loading, errors, empty states

------

# P1 – Mandatory Business Flow (Grading Core)

Implements the required workflow end-to-end.

------

## P1.1 – Register Page

- Form fields: name, username, email, password, bio, skills[]
- Handle 409 suggested_username
- Redirect to login on success

Acceptance Criteria:

- All documented errors handled
- Suggested username displayed

------

## P1.2 – Login Page

- Store token
- Store user
- Redirect to intended route

Acceptance Criteria:

- JWT persisted
- Protected routes accessible

------

## P1.3 – Job Search Page

- Implement filters
- Default status = open
- Display results
- Empty state support

Acceptance Criteria:

- 400 min_budget handled
- Results render correctly

------

## P1.4 – Create Job Page

- Protected route
- Form fields: title, description, budget, category

Acceptance Criteria:

- 400 missing fields handled
- Job created successfully

------

## P1.5 – Job Details Page

- Display job data
- Display owner summary
- Display freelancer summary (if assigned)
- Render action panel dynamically

Acceptance Criteria:

- Correct actions based on role/status
- All errors displayed

------

## P1.6 – Submit Proposal

- Submit from job details
- Prevent own job submission
- Disable if job not open

Acceptance Criteria:

- 409 pending proposal handled
- 400 invalid job state handled

------

## P1.7 – Owner Proposal List

- List proposals for job
- Accept proposal
- Confirmation dialog required

Acceptance Criteria:

- Accept triggers job in_progress
- Other proposals rejected automatically

------

## P1.8 – Complete Job

- Allow only if in_progress
- Only owner or assigned freelancer

Acceptance Criteria:

- 400 only in-progress handled
- Status updates correctly

------

## P1.9 – Submit Reviews

- Submit review for completed job
- Prevent self-review
- Prevent duplicate review

Acceptance Criteria:

- rating 1–5 validated
- 409 duplicate review handled
- Rating refreshes correctly

------

# P2 – Completeness & Coverage

------

## P2.1 – My Profile Page

- GET /users/me
- Display full profile data

------

## P2.2 – Public Profile Page

- GET /users/:username

------

## P2.3 – My Postings Page

- GET /jobs/my-postings

------

## P2.4 – My Bids Page

- GET /proposals/my-bids
- Delete pending proposal

------

## P2.5 – User Reviews Page

- GET /reviews/user/:id

------

## P2.6 – Platform Stats Page

- GET /platform/stats

------

# P3 – UX Hardening (Mandatory Behaviors)

------

## P3.1 – Global Loading Handling

- Disable submit while pending
- Show spinner for async operations

------

## P3.2 – Global Error Handling

- Display 400/401/403/404/409 everywhere
- No swallowed errors

------

## P3.3 – Confirmation Enforcement

- Accept proposal requires confirm
- Complete job requires confirm
- Delete proposal requires confirm

------

## P3.4 – Empty State Coverage

- All list pages show empty-state when no data

------

## P3.5 – Business Rule UI Enforcement

- Hide illegal actions
- Disable illegal actions
- Backend remains authoritative

------

# Definition of Done (Project Level)

The project is considered complete when:

- Full mandatory flow works without errors
- All documented backend errors are handled
- No mocked data exists
- JWT handling is correct
- All routes function properly
- Repository structure matches architecture document
- Code is clean and separated by layer