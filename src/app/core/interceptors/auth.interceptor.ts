import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, throwError } from 'rxjs'

import { AuthStore } from '../auth/auth.store'

/**
 * AuthInterceptor
 *
 * Purpose
 * -------
 * Automatically attach the JWT authentication token to
 * outgoing HTTP requests.
 *
 * Motivation
 * ----------
 * Most backend endpoints require authentication.
 *
 * Without an interceptor every service would need to manually attach:
 *
 * Authorization: Bearer <token>
 *
 * This interceptor centralizes that behavior.
 *
 * Architectural Flow
 *
 * Component
 *   ↓
 * Feature Service
 *   ↓
 * ApiClient
 *   ↓
 * HttpClient
 *   ↓
 * AuthInterceptor
 *   ↓
 * Backend API
 *
 * Responsibilities
 * ----------------
 * 1. Read the authentication token from AuthStore
 * 2. Attach Authorization header when a token exists
 * 3. Handle 401 responses (expired or invalid token)
 *
 * The interceptor executes automatically for every HttpClient request.
 */

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const store = inject(AuthStore)
  const router = inject(Router)

  const token = store.token()

  /**
   * Attach Authorization header if a token exists.
   */
  if (token) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return next(req).pipe(

    catchError(error => {

      /**
       * If the backend reports the token is invalid or expired,
       * clear the session and redirect the user to the login page.
       */
      if (error.status === 401) {

        store.clearSession()

        router.navigate(['/login'], {
          queryParams: {
            returnUrl: router.url,
            reason: 'session_expired' // will produce a URL like : /login?returnUrl=/jobs/42&reason=session_expired
          }
        })
      }

      /*
      USAGE in Login component:

      const reason = this.route.snapshot.queryParamMap.get('reason')

      if (reason === 'session_expired') {
        this.apiError = 'Session expired. Please login again.'
      }

      */

      return throwError(() => error)
    })
  )
}
/**
 * Implementation Notes
 * --------------------
 *
 * The previous version attached the Authorization header based on
 * `store.isAuthenticated()`.
 *
 * Adjustment made:
 *
 * - The interceptor now checks `store.token()` directly.
 *
 * Rationale
 * ---------
 * The interceptor's responsibility is only to attach the JWT token when
 * it exists. It should not rely on higher-level authentication logic.
 *
 * Additional adjustments:
 *
 * - Ensured errors are propagated using `throwError()` so services and
 *   components can properly handle API failures.
 * - Session invalidation now calls `clearSession()` to reflect that the
 *   token became invalid rather than representing an explicit user logout.
 */