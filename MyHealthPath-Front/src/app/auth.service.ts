import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private isAuthenticatedStatus = false;

  constructor(private http: HttpClient) {}

  // Login method to send credentials to the backend
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticatedStatus = true;
        localStorage.setItem('isAuthenticated', 'true');
      })
    );
  }

  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`, { withCredentials: true });
  }
  
  // Logout method to clear session storage
  logout() {
    this.isAuthenticatedStatus = false;
    localStorage.removeItem('isAuthenticated');
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
  

   // Check if the user is authenticated by checking user data in localStorage
   isAuthenticated(): boolean {
    return this.isAuthenticatedStatus || localStorage.getItem('isAuthenticated') === 'true';
  }

  register(email: string, password: string, fullName: string, specialite: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password, fullName, specialite }, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.setItem('isAuthenticated', 'true');
      })
    );
  }
}
