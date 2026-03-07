import { Injectable, signal, computed } from '@angular/core'
import { User } from '../models/user.model'


@Injectable({providedIn: 'root'})
export class AuthStore {
  private readonly KEY ="platform_authn"


  readonly token = signal<string | null>(localStorage.getItem(this.KEY));
  readonly user  = signal<User   | null>(null)
  readonly isAuthenticated = computed(() => !!this.token());


  login(token: string, user: User){
    localStorage.setItem(this.KEY,token);

    this.token.set(token);
    this.user.set(user);
  }

  logout() {
    localStorage.removeItem(this.KEY);
    this.token.set(null);
    this.user.set(null);
  }
}

