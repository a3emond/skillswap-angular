import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, throwError } from 'rxjs'

import { BASE_API_URL } from '../config/api.config'
import { normalizeError } from './error.util'

/**
 * ApiClient
 *
 * Purpose
 * -------
 * Centralized HTTP wrapper used by all domain services.
 *
 * Motivation
 * ----------
 * Without this wrapper each service would need to:
 *
 * - prepend the API base URL
 * - handle HttpErrorResponse
 * - normalize backend error payloads
 *
 * Centralizing this logic guarantees consistent behaviour across the
 * application and prevents duplication.
 *
 * Architectural Flow
 *
 * Component
 *   ↓
 * Feature Service (jobs.service, auth.service, etc)
 *   ↓
 * ApiClient
 *   ↓
 * Angular HttpClient
 *   ↓
 * Backend API
 *
 * Responsibilities
 * ----------------
 * 1. Automatically prefix the API base URL
 * 2. Provide typed HTTP helpers
 * 3. Normalize backend errors into ApiError objects
 *
 * Services must NEVER use HttpClient directly.
 */
@Injectable({ providedIn: 'root' })
export class ApiClient {

  constructor(private readonly http: HttpClient) {}

  /**
   * GET request helper.
   *
   * Example usage inside a service:
   *
   *   return this.api.get<User>('/users/me')
   */
  get<T>(path: string): Observable<T> {
    return this.http
      .get<T>(`${BASE_API_URL}${path}`)
      .pipe(catchError(this.handleError))
  }

  /**
   * POST request helper.
   *
   * Example usage:
   *
   *   return this.api.post<Job>('/jobs', dto)
   */
  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<T>(`${BASE_API_URL}${path}`, body)
      .pipe(catchError(this.handleError))
  }

  /**
   * PATCH request helper.
   */
  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<T>(`${BASE_API_URL}${path}`, body)
      .pipe(catchError(this.handleError))
  }

  /**
   * DELETE request helper.
   */
  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${BASE_API_URL}${path}`)
      .pipe(catchError(this.handleError))
  }

  /**
   * Error handler used by all requests.
   *
   * RxJS catchError requires returning an Observable.
   * throwError creates an observable that emits the normalized ApiError.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(() => normalizeError(error))
  }
}