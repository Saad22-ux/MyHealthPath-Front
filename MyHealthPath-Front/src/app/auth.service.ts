import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'; //false in var

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private isAuthenticatedStatus = new BehaviorSubject<boolean>(this.hasToken());
  private role: string = localStorage.getItem('role') || '';  // Initialize role from localStorage

  private userRoleSubject = new BehaviorSubject<string>(localStorage.getItem('role') || '');
  userRole$ = this.userRoleSubject.asObservable();


  isAuthenticated$ = this.isAuthenticatedStatus.asObservable();


  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  // Login method to send credentials to the backend
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        this.isAuthenticatedStatus.next(true);
        localStorage.setItem('isAuthenticated', 'true');
      
      // Set role from login response
      const userRole = response.role; // adjust if it's nested like response.user.role
      this.setRole(userRole);
      localStorage.setItem('role', userRole);
      })  
    );
  }

  
  // Logout method to clear session storage
  logout() {
    this.isAuthenticatedStatus.next(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    this.role = '';
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
  

   // Check if the user is authenticated by checking user data in localStorage
  isAuthenticated(): boolean {
    return this.hasToken();//this.isAuthenticatedStatus || localStorage.getItem('isAuthenticated') === 'true';
  }


  register(email: string, password: string, fullName: string, specialite: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password, fullName, specialite }, { withCredentials: true }).pipe(
      tap(() => {
      })
    );
  }


  setRole(role: string) {
    this.role = role;
    localStorage.setItem('role', role);
    this.userRoleSubject.next(role); // ✅ This triggers the role update in the navbar
  }

  getUserRole(): string {
    if (!this.role) {
      this.role = localStorage.getItem('role') || '';
    }
    return this.role;
  }
  

  isLoggedIn(): boolean {
    return !!this.role; // or use a proper check
  }
}
