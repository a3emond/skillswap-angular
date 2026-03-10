import { ApiClient } from "../../http/api-client";
import { ApiError } from "../../http/api-error.model";

export type NotFoundError = ApiError & {
  status: 404
}

export type UserNotFoundError = NotFoundError & {
  message: "User not found"
}