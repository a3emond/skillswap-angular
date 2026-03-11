import { inject, Injectable }           from '@angular/core';
import { catchError, Observable, tap, throwError }  from 'rxjs';
import { ApiClient }                    from '../http/api-client';
import { ApiError }                     from '../http/api-error.model';
import { AuthStore }                    from '../auth/auth.store';
import { User }                         from "../models/user.model";
import { RegisterResponseDto } from '../models/dto/register-response.dto';


/**
  * list des containers utilises
  */
export type RegisterDto = {
    name: string;
    username: string;
    email: string;
    password: string;
    bio: string;
    skills: string[];
};
export type LoginDto = {
    email: string;
    password: string;
};



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


    Login(dto: LoginDto): Observable<RegisterResponseDto> {
        return this.#http.post('/auth/login', dto)
            .pipe(
                tap({
                  next:(response: any) => {
                    let token = response.token;
                    let user  = response.user;
                    this.#store.CreateSession(token, user);

                    console.log("token has been created")
                  }
                }),
                catchError((err: ApiError)=> {
                    console.error("Error sent: ", err);
                    return throwError(()=> err);
                })
            );
    };

    Logout() {
      if(this.#store.isAuthenticated()) {
          this.#store.ClearSession()
      }
    }

    Authenticated(){
        return this.#store.isAuthenticated()
    }
}


/** list des reponses
  *
  *
  */
export type LoginResponseDto = {
    token: string;
    user: User;
};



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


