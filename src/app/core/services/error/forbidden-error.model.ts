import { ApiError } from "../../http/api-error.model";

export type ForbiddenError = ApiError & {
    status: 403,
    message: "Forbidden"
}