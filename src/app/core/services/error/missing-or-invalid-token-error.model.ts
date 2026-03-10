import { ApiError } from "../../http/api-error.model";

export type MissingOrInvalidTokenError = ApiError & {
    status: 401,
    message: "Missing or invalid token"
} | InvalidTokenError

type InvalidTokenError = ApiError & {
    status: 401,
    message: "Invalid token"
}