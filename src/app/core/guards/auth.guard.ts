import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthStore } from '../auth/auth.store'

/**
 * AuthGuard
 *
 * Purpose
 * -------
 * Protect routes that require authentication.
 *
 * Motivation
 * ----------
 * Certain areas of the application should only be accessible
 * to authenticated users.
 *
 * Examples:
 *
 * - creating jobs
 * - submitting proposals
 * - writing reviews
 *
 * Instead of checking authentication inside every component,
 * route guards allow protecting entire sections of the application.
 *
 * Architectural Flow
 *
 * Router navigation
 *   ↓
 * AuthGuard executes
 *   ↓
 * AuthStore.isAuthenticated()
 *
 * true  → navigation allowed
 * false → redirect to /login
 *
 * Responsibilities
 * ----------------
 * 1. Verify that the user is authenticated
 * 2. Block navigation when the user is not logged in
 * 3. Redirect to the login page
 *
 * Guards execute automatically during Angular routing.
 */


/*{
  path: 'school',
  component: SchoolComponent,
  canActivate: [authGuard],                      <- EXACTEMENT!!
  data: { claims: ['admin', 'teacher'] }
}*/
export const authGuard: CanActivateFn = (route, state) => {

    const router = inject(Router)
    const store = inject(AuthStore)

  /**
   * Allow navigation if authenticated.
   */
  if (store.isAuthenticated()) {
    return true
  }

  /**
   * Otherwise redirect to login.
   * The attempted URL is preserved for post-login redirect.
   */
  return router.createUrlTree(
    ['/login'],
    { queryParams: { returnUrl: state.url } }
  )
}
