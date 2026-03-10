import { inject, Injectable } from '@angular/core';
import { catchError, of, tap, throwError } from 'rxjs';
import { ApiClient } from '../http/api-client';
import { RegisterDto } from '../models/dto/register.dto';
import { ApiError } from '../http/api-error.model';
import { LoginDto } from '../models/dto/login.dto';
import { AuthStore } from '../auth/auth.store';
import { LoginResponseDto } from '../models/dto/login-response.dto';





@Injectable({providedIn: 'root'})
export class AuthService {
    readonly #http: ApiClient = inject(ApiClient);
    readonly #store:AuthStore = inject(AuthStore);

    Register(dto: RegisterDto) {
        return this.#http.post('/auth/register',dto)
            .pipe(
                catchError((err: ApiError) => {
                    console.error("Error sent: ", err);
                    return throwError(()=> err);
                })
            );
    }


    Login(dto: LoginDto) {
        return this.#http.post('/auth/register', dto)
            .pipe(
                tap({
                  next:(response: any) => {
                    let r: LoginResponseDto = JSON.parse(response);
                    this.#store.CreateSession(r.token, r.user)
                  }
                }),
                catchError((err: ApiError)=> {
                    console.error("Error sent: ", err);
                    return throwError(()=> err);
                })
            );
    }
    Logout() {
      if(this.#store.isAuthenticated()) {
          this.#store.ClearSession()
      }
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
    message: "Missing required fields"
}

export type InvalidUsername = ApiError & {
    status : 400,
    message: "Invalid username",
}

export type MissingEmailOrPassword = ApiError & {
    status : 400,
    message: "Email and password are required"
}

//401
export type InvalidCredentials = ApiError & {
    status : 401,
    message: "Invalid Credentials"
}

//409
export type EmailAlreadyInUse = ApiError & {
    status : 409,
    message: "Email is already in use",
}
export type UsernameAlreadyInUse = ApiError & {
    status : 409,
    message: "Username is already in use",
    suggested_username: String
}


