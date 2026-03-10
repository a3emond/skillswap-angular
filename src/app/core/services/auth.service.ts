
import { inject, Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { ApiClient } from '../http/api-client';
import { RegisterDto } from '../models/dto/register.dto';
import { ApiError } from '../http/api-error.model';





@Injectable({providedIn: 'root'})
export class AuthService {
    readonly #http: ApiClient = inject(ApiClient);

    Register(dto: RegisterDto) {
        return this.#http.post('/auth/register',dto)
        .pipe(
            catchError((err: ApiError) => {
                console.error("Error sent: ", err);
                return throwError(()=> err);
            })
        );
    }
}

/*
  Erreurs possibles :
      400 – Missing required fields
      400 – Invalid username
      409 – Email already in use
      409 – Username already in use (retourne suggested_username)
*/

export type MissingRequiredFields = ApiError & {
    status : 400,
    message: "missing required fields"
}

export type InvalidUsername = ApiError & {
    status : 400,
    message: "Invalid ",

}

//409
export type EmailAlreadyInUse = ApiError & {
    status : 409,
    message: "Email is already in use",
}
export type UsernameAlreadyInUse = ApiError & {
    status : 409,
    message: "username is already in use",
    suggested_username: String
}


