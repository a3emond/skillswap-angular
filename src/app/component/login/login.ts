import { Component, computed, inject, signal } from '@angular/core';
import { AuthService, LoginDto } from '../../core/services/auth.service';
import { AuthStore } from '../../core/auth/auth.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
    auth        = inject(AuthService);
    authstore   = inject(AuthStore);
    email       = signal<string | null>(null);
    errEmail    = signal<string | null>(null);
    password    = signal<string | null>(null);
    errPassword = signal<string | null>(null);
    errApi      = signal<string | null>(null);

    guard       = computed(()=> !!this.email() && !!this.password());

    Login(){
        if(!this.guard()) {
            return;
        }

        const dto: LoginDto = {
          email   : this.email()!,
          password: this.password()!,

        }

        this.auth.Login(dto).subscribe({
    next: (res) => {
      console.log('Component received:', res);
      // You could navigate here: this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      // This is where your signal gets the error message for the HTML
      this.errApi.set(err.message);
    }
  });
    }

    sanitizeEmail(email: string) {
        const trimmed = email.trim();
        if(!trimmed || trimmed.length === 0) {
          this.email.set(null);
          this.errEmail.set("Email can't be null")
          return;
        }
        this.email.set(trimmed);
        this.errEmail.set(null)
    }

    sanitizePassword(password: string) {
        const trimmed = password.trim();
        if(!trimmed || trimmed.length === 0) {
          this.password.set(null);
          this.errPassword.set("Password can't be null")
          return;
        }
        this.password.set(trimmed);
        this.errPassword.set(null)

    }
}
