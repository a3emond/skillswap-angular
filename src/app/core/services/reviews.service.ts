import { Injectable, inject } from "@angular/core";
import { AuthStore } from "../auth/auth.store";
import { ApiClient } from "../http/api-client";
import { CreateReviewDto } from "../models/dto/create-review.dto";
import { ApiError } from "../http/api-error.model";
import { catchError, of, throwError } from "rxjs";



@Injectable({providedIn: 'root'})
export class Review {
    readonly #store: AuthStore = inject(AuthStore);
    readonly #http : ApiClient = inject(ApiClient);


    getReview(id: number) {
        return this.#http.get(`reviews/user/${id}`)
          .pipe(
              catchError((err: any) => {
                  console.error("Error sent: " + err);
                  return throwError(()=> err);
              })
          );
    };

    createReview(job_id: string, dto: CreateReviewDto) {
        if(!this.#store.isAuthenticated()){
            return of(null);
        };
        return this.#http.post(`/jobs/${job_id}/reviews/`,dto)
            .pipe(
                catchError((err: any)=> {
                    console.error("Error sent: " + err);
                    return throwError(()=> err);
                })
            );
    }

}

export type JobNotFound = ApiError & {
    status : 404,
    message: "Job not found"
}

export type TargetUserNotFound = ApiError & {
    status: 404,
    message: "Target user not found"
}

// 403 - Forbidden
export type ActionForbidden = ApiError & {
    status: 403,
    message: "Forbidden"
}

// 409 - Conflict
export type AlreadyReviewed = ApiError & {
    status: 409,
    message: "You already reviewed this user for this job"
}

// 400 - Bad Request (Business Logic & Validation)
export type JobNotCompleted = ApiError & {
    status: 400,
    message: "Reviews are allowed only for completed jobs"
}

export type MissingReviewFields = ApiError & {
    status: 400,
    message: "target_id and rating are required"
}

export type SelfReviewError = ApiError & {
    status: 400,
    message: "You cannot review yourself"
}

export type InvalidUserId = ApiError & {
    status: 400,
    message: "Invalid user id"
}

export type InvalidTargetUser = ApiError & {
    status: 400,
    message: "target_id must be the other participant"
}

export type InvalidRatingValue = ApiError & {
    status: 400,
    message: "rating must be an integer between 1 and 5"
}
