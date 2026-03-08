import { Injectable, signal, computed } from '@angular/core'
import { User } from '../models/user.model'


@Injectable({providedIn: 'root'})
export class AuthStore {
  private readonly TOKEN_KEY ="platform_authn"
  private readonly USER_KEY ="platform_user"


  private token = localStorage.getItem(this.TOKEN_KEY);

  private user  = this.parseUser();

  private isAuthenticated = this.token !== null;


  StoreSession(token: string, user: User){
    localStorage.setItem(this.TOKEN_KEY,token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    this.token = token;
    this.user  = user;
  }

  ClearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token = null;
    this.user  = null;
  }


  private parseUser(): User | null{
    const raw = localStorage.getItem(this.USER_KEY);

    return raw ? JSON.parse(raw): null;
  }

}

