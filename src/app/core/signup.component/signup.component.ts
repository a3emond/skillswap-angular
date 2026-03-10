import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-signup.component',
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
    authService = inject(Auth);

    name            =signal<string | null>(null);
    errName         =signal<string | null>(null);

    username        =signal<string | null>(null);
    errUsername     =signal<string | null>(null);

    email           =signal<string | null>(null);
    errEmail        =signal<string | null>(null);

    password        =signal<string | null>(null);
    errPassword     =signal<string | null>(null);

    bio             =signal<string | null>(null);
    errBio          =signal<string | null>(null);
    skills:string[] =[];


    Register() {

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
