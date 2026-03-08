/**
 * ApiError
 *
 * Standard error structure used throughout the frontend.
 *
 * Angular's HttpClient throws HttpErrorResponse objects whose structure
 * varies depending on the failure source (backend error, network failure,
 * parsing error, etc).
 *
 * This type defines a simplified and predictable error shape that UI
 * components can safely consume.
 *
 * Properties
 * ----------
 * status
 *   HTTP status code returned by the backend.
 *
 * message
 *   Human-readable error message extracted from the backend response.
 *
 * raw
 *   Original backend payload preserved for debugging or inspection.
 */
export type ApiError = {
  status: number
  message: string
  raw?: unknown
}