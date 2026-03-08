import { Injectable, signal, computed } from '@angular/core'
import { User } from '../models/user.model'


@Injectable({providedIn: 'root'})
export class AuthStore {
  private readonly TOKEN_KEY ="platform_authn";
  private readonly USER_KEY ="platform_user";


  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  readonly isAuthenticated = computed(() => !!this.token());

  readonly user = signal<User | null>(this.ParseUser());


  CreateSession(token: string, user: User){
    localStorage.setItem(this.TOKEN_KEY,token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    this.token.set(token);
    this.user.set(user);
  }

  ClearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.user.set(null);
  }


  private ParseUser(): User | null{
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw): null;
  }

}

