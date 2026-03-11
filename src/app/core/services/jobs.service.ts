
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { JobSearchDto } from "../models/dto/job-search.dto";
import { Job } from "../models/job.model";
import { catchError, Observable, throwError } from "rxjs";
import { ApiError } from "../http/api-error.model";
import { JobCreateDto } from "../models/dto/job-create.dto";
import { AuthStore } from "../auth/auth.store";
import { JobUpdateDto } from "../models/dto/job-update.dto";
import { ApiClient } from "../http/api-client";







@Injectable({
    providedIn: 'root'
}) class JobService {
    private readonly http: ApiClient = inject(ApiClient);
    private readonly authStore: AuthStore = inject(AuthStore);

    search(category: string|null = null, status: string|null = null, min_budget: number|null = null): Observable<Job[]> {
        const body: JobSearchDto = {
            category: category || undefined,
            status: status || undefined,
            min_budget: min_budget || undefined
        };
        return this.http.post<Job[]>('/jobs/search', body)
        .pipe(
            catchError((err: ApiError) => {
                // Handle error, e.g., log it or show a notification
                console.error('Failed to search jobs', err);
                // Return a fallback value or rethrow the error`
                return throwError(() => err);
            })
        );
    }

    create(title: string, description: string, category: string, budget: number): Observable<Job> {
        if(!this.authStore.isAuthenticated()) {
            const error: ApiError = {
                status: 401,
                message: "User is not authenticated"
            };
            console.error('User is not authenticated', error);
            return throwError(() => error);
        }
        const body: JobCreateDto = {
            title: title,
            description: description,
            category: category,
            budget: budget
        };

        return this.http.post<Job>('/jobs', body)
            .pipe(
                catchError((err: ApiError) => {
                    console.error('Failed to create job', err);
                    return throwError(() => err);
                })
            );
    }

    getById(jobId: number): Observable<Job> {
        if(!this.authStore.isAuthenticated()) {
            const error: ApiError = {
                status: 401,
                message: "User is not authenticated"
            };
            console.error('User is not authenticated', error);
            return throwError(() => error);
        }

        return this.http.get<Job>(`/jobs/${jobId}`)
        .pipe(
            catchError((err: ApiError) => {
                console.error(`Failed to fetch job with id ${jobId}`, err);
                return throwError(() => err);
            })
        );
    }

    update(job_id: number, dto: JobUpdateDto): Observable<Job> {
        if(!this.authStore.isAuthenticated()) {
            const error: ApiError = {
                status: 401,
                message: "User is not authenticated"
            };
            console.error('User is not authenticated', error);
            return throwError(() => error);
        }

        return this.http.patch<Job>(`/jobs/${job_id}`, dto)
            .pipe(
                catchError((err: ApiError) => {
                    console.error(`Failed to update job with id ${job_id}`, err);
                    return throwError(() => err);
                })
            );
    }


}

export type MinBudgetError = ApiError & {
    status: 400,
    message: "min_budget must be numeric"
};

export type MissingRequiredFieldError = ApiError & {
    status: 400,
    message: "Missing required fields"
};

export type JobNotFoundError = ApiError & {
    status: 404,
    message: "Job not found"
};

export type CompletionStatusError = ApiError & {
    status: 400,
    message: "Only in-progress jobs can be completed"
};
