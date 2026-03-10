import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../models/dto/register.dto';
import { ApiError } from '../http/api-error.model';

@Component({
  selector: 'app-signup.component',
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
    authService = inject(AuthService);

    name            =signal<string | null>(null);
    errName         =signal<string | null>(null);

    username        =signal<string | null>(null);
    errUsername     =signal<string | null>(null);

    email           =signal<string | null>(null);
    errEmail        =signal<string | null>(null);

    password        =signal<string | null>(null);
    errPassword     =signal<string | null>(null);

    bio             =signal<string | null>(null);
    skills:string[] =[];
    //flag to make sure weither all necessary fields are valid
    guard           =computed(()=>
                              !!this.name()     &&
                              !!this.username() &&
                              !!this.email()    &&
                              !!this.password()
                    );
    errMessage      =signal<string | null>(null);


    async Register() {
        if(!this.guard()){

          return;
        }
        const dto: RegisterDto = {
            name    : this.name()     !,
            username: this.username() !,
            email   : this.email()    !,
            password: this.password() !,
            bio     : this.bio()  ?? '',
            skills  : this.skills      ,
        }
        this.authService.Register(dto).subscribe({
            next: (res) => {
                this.errMessage.set(null);
                console.log('Registration successful', res);
            },
            error: (err: ApiError) => {
                this.errMessage.set(err.message || "An error occurred during registration");
            }
        });
    }


    SanitizeName(name: string){
        const trimmed = name.trim();
        if (!trimmed || trimmed.length === 0) {
            this.errName.set("name can't be empty");
            this.name.set(null);
            return;
        }
            this.errName.set(null);
            this.name.set(trimmed);
    }

    SanitizeUsername(username: string){
        const trimmed = username.trim();
        if (!username || username.length === 0) {
            this.errUsername.set("Username can't be empty");
            this.username.set(null)
        }
        this.errUsername.set(null)
        this.username.set(trimmed);
    }
    SanitizeEmail(email: string){
        const trimmed = email.trim();
        if (!trimmed || trimmed.length === 0) {
            this.errEmail.set("Email can't be empty");
            this.email.set(null);
        }
        this.errEmail.set(null);
        this.email.set(trimmed);
    }
    SanitizePassword(psw: string){
        const trimmed = psw.trim();
        if (!trimmed || trimmed.length === 0) {
            this.password.set("Password can't be empty")
            this.password.set(null)
        }
        this.errPassword.set(null);
        this.password.set(trimmed);
    }
    SanitizeSkillInsertion(skill: string){
        if (skill || skill.length > 0) {
          this.skills.push(skill);
        }
    }
}
