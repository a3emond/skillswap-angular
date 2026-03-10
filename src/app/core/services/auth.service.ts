
import { inject, Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { ApiClient } from '../http/api-client';
import { RegisterDto } from '../models/dto/register.dto';

/**
    MODULE AUTHENTIFICATION
    POST /auth/register
    Crée un nouveau compte utilisateur.
    Champs obligatoires :
        • name
        • username
        • email
        • password
        • bio
        • skills (tableau)
    Succès (201)
    Retourne un message et l’objet utilisateur créé.
    Erreurs possibles :
      400 – Missing required fields
      400 – Invalid username
      409 – Email already in use
      409 – Username already in use (retourne suggested_username)
    Votre frontend doit afficher correctement le nom d’utilisateur suggéré si présent.
 */


@Injectable({providedIn: 'root'})
export class AuthService {
    readonly #http: ApiClient = inject(ApiClient);

    Register(dto: RegisterDto) {
        return this.#http.post('/auth/register',dto)
        .pipe(
            catchError((err: any) => {

                let error: any;
                switch(err.status) {
                  case 405:
                      error = err.body.contains("username")
                          ? new InvalidUsername()
                          : new MissingRequiredFields()
                      break;

                  case 409:
                      error = err.body == null
                          ? new EmailAlreadyInUse()
                          : new UsernameAlreadyInUse(err.body)
                      break;

                  default: throw new Error("Internal Error");
                }

                return throwError(()=> error);
            })
        );
    }
}

//400
class MissingRequiredFields extends Error {
  constructor(message: string = "Missing required fields") {
    super(message);
    this.name = 'MissingRequiredFields';
    Object.setPrototypeOf(this, MissingRequiredFields.prototype);
  }
}
class InvalidUsername extends Error {
  constructor(message: string = "InvalidUsername") {
    super(message);
    this.name = 'InvalidUsername';
    Object.setPrototypeOf(this, InvalidUsername.prototype);
  }
}

//409 special error
class EmailAlreadyInUse extends Error {
  constructor(message: string = "Email already in use") {
    super(message);
    this.name = 'EmailAlreadyInUse';
    Object.setPrototypeOf(this, EmailAlreadyInUse.prototype);
  }
}
class UsernameAlreadyInUse extends Error {
  constructor(body: string, message: string = "Username already in use") {
    super(message);
    this.name = 'UsernameAlreadyInUse';
    Object.setPrototypeOf(this, UsernameAlreadyInUse.prototype);
  }
}


