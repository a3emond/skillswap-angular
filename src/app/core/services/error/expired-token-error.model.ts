import { ApiError } from "../../http/api-error.model";

export type ExpiredTokenError = ApiError & {
    status: 401,
    message: "Token has expired"
}