import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from '../models/user.model';
import { BehaviorSubject, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =
    ' http://localhost:5555/api/auth';
  authenticator$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private http: HttpClient) {}

  login(User: user) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, User).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.authenticator$.next(true);
      })
    );
  }

  singUp(User: user) {
    return this.http.post(`${this.apiUrl}/register`, User);
  }

  logout() {
    localStorage.removeItem('token');
    this.authenticator$.next(false);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  loginIfAuthenticated(): boolean {
    if (this.getToken()) {
      this.authenticator$.next(true);
      return true;
    }
    return false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
