
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, of, throwError } from 'rxjs';
import { ApiError } from '../http/api-error.model';
import { ApiClient } from '../http/api-client';
import { User } from '../models/user.model';
import { AuthStore } from '../auth/auth.store';


@Injectable({
    providedIn: 'root'
}) export class UsersService {

    readonly #authStore: AuthStore = inject(AuthStore);
    readonly #http: ApiClient = inject(ApiClient);
    readonly #snackBar: MatSnackBar = inject(MatSnackBar);

    /**
     * Makes a request to the backend to get the profile of the currently authenticated user.
     * 
     * If the user is not authenticated, it returns an Observable of null.  
     * If the user is authenticated, it makes a GET request to the /users/me endpoint to retrieve the user's profile.  
     * If the request fails, it catches the error, logs it, shows a notification with the error message, and rethrows the error.  
     * 
     * @returns {Observable<User|null>} An Observable that emits the user's profile or null if not authenticated.
     */
    getMyProfile(): Observable<User|null> {
        if (!this.#authStore.isAuthenticated()) {
            return of(null);
        }

        // token should be added by the JWT interceptor, so we can just make the request without adding the token in the header

        return this.#http.get<User>('/users/me')
        .pipe(
            catchError((err: ApiError) => {
                // Handle error, e.g., log it or show a notification
                console.error('Failed to fetch user profile', err);
                return throwError(() => err);
            })
        );


    }

    /**
     * Makes a request to the backend to get the profile of a user by their ID.  
     * 
     * If the request fails, it catches the error, logs it, shows a notification with the error message, and rethrows the error.
     * 
     * @param {number} userId - The ID of the user whose profile to retrieve.
     * @returns {Observable<User>} An Observable that emits the user's profile.
     */
    getUserById(userId: number): Observable<User> {
        return this.#http.get<User>(`/users/${userId}`)
        .pipe(
            catchError((err: ApiError) => {
                // Handle error, e.g., log it or show a notification
                console.error(`Failed to fetch user with ID ${userId}`, err);
                // Return a fallback value or rethrow the error                
                return throwError(() => err);
            })
        );
    }
}