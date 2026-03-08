import { Injectable, signal, computed } from '@angular/core'
import { User } from '../models/user.model'

/**
 * AuthStore
 *
 * Purpose
 * -------
 * Centralized authentication state container.
 *
 * This store keeps the current authenticated session in memory and
 * persists it across browser refreshes using localStorage.
 *
 * Motivation
 * ----------
 * Several parts of the application need access to authentication state:
 *
 * - HTTP interceptor (attach JWT)
 * - Route guards (protect routes)
 * - UI components (display current user)
 *
 * Instead of reading localStorage everywhere, this store provides a
 * single source of truth for the authentication session.
 *
 * Architectural Flow
 *
 * Login Component
 *   ↓
 * AuthService
 *   ↓
 * ApiClient → Backend
 *   ↓
 * AuthStore.setSession(token, user)
 *
 * Consumers
 *
 * AuthInterceptor → token()
 * AuthGuard       → isAuthenticated()
 * UI Components   → user()
 *
 * Responsibilities
 * ----------------
 * 1. Store authentication token
 * 2. Store authenticated user
 * 3. Persist session across refresh
 * 4. Expose reactive authentication state
 *
 * The store MUST NOT:
 *
 * - call backend APIs
 * - perform navigation
 * - attach HTTP headers
 */

@Injectable({ providedIn: 'root' })
export class AuthStore {

  private readonly TOKEN_KEY = 'platform_auth_token'
  private readonly USER_KEY  = 'platform_auth_user'

  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY))
  readonly user  = signal<User | null>(this.readUser())

  readonly isAuthenticated = computed(() => !!this.token())

  /**
   * Stores a new authenticated session.
   *
   * Called after successful login or registration.
   */
  setSession(token: string, user: User) {

    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))

    this.token.set(token)
    this.user.set(user)
  }

  /**
   * Clears the current authentication session.
   *
   * Used when the user logs out or when the backend
   * reports an invalid/expired token.
   */
  clearSession() {

    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)

    this.token.set(null)
    this.user.set(null)
  }

  /**
   * Safely restores the stored user from localStorage.
   */
  private readUser(): User | null {

    const raw = localStorage.getItem(this.USER_KEY)

    return raw ? JSON.parse(raw) : null
  }
}

/**
 * Implementation Notes
 * --------------------
 *
 * The initial version of this store used Angular signals and exposed
 * `login()` / `logout()` methods.
 *
 * Adjustments made:
 *
 * - Method names changed to `setSession()` and `clearSession()` to better
 *   reflect the store responsibility (state management only).
 * - Added restoration of the stored user from localStorage on application start.
 * - Persist both token and user for consistent session recovery.
 *
 * Rationale
 * ---------
 * The store should act purely as a session container and must not imply
 * authentication logic such as performing the login request itself.
 *
 * API calls remain the responsibility of AuthService.
 */