import { HttpErrorResponse } from '@angular/common/http'
import { ApiError } from './api-error.model'

/**
 * normalizeError
 *
 * Purpose
 * -------
 * Converts Angular HttpErrorResponse objects into the application's
 * standardized ApiError structure.
 *
 * The SkillSwap backend returns errors using the format:
 *
 *   { "error": "message" }
 *
 * Angular wraps this response inside HttpErrorResponse, which may contain
 * different structures depending on the failure scenario.
 *
 * This function safely extracts the backend message while providing a
 * fallback message if the expected structure is not present.
 *
 * Example transformation
 *
 * Backend response:
 *   HTTP 400
 *   { "error": "Missing required fields" }
 *
 * Result:
 *   {
 *     status: 400,
 *     message: "Missing required fields"
 *   }
 */
export function normalizeError(error: HttpErrorResponse): ApiError {

  let message = 'Unexpected error'

  if (
    error.error &&
    typeof error.error === 'object' &&
    'error' in error.error
  ) {
    message = error.error.error
  }

  return {
    status: error.status,
    message,
    raw: error.error
  }
}