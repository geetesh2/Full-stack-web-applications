import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from '../models/user.model';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:5225/api/auth'; // Adjust as needed


  constructor(private http: HttpClient) { }

  login( User:user){
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, User).pipe(tap((response) => {
          localStorage.setItem('token', response.token);
        }))
  }

  singUp(User:user){
   return this.http.post(`${this.apiUrl}/register`, User);
  }

  logout(){
    localStorage.removeItem('token');
    
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
