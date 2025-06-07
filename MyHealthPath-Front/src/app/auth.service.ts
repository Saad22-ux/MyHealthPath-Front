import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Subject  } from 'rxjs'; 
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private isAuthenticatedStatus = new BehaviorSubject<boolean>(this.hasToken());
  private role: string = localStorage.getItem('role') || '';
  private userRoleSubject = new BehaviorSubject<string>(localStorage.getItem('role') || '');
  userRole$ = this.userRoleSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedStatus.asObservable();
  logout$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.isAuthenticatedStatus.next(true);
        localStorage.setItem('isAuthenticated', 'true');

        const userRole = response.role;
        this.setRole(userRole);
        localStorage.setItem('role', userRole);
        localStorage.setItem('userId', response.id);

        if (response.patientId) {
          localStorage.setItem('patientId', response.patientId.toString());
        } else {
          localStorage.removeItem('patientId');
        }
      })  
    );
  }

  logout() {
    this.isAuthenticatedStatus.next(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('patientId');
    this.role = '';

    this.logout$.next(); 
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  register(email: string, password: string, fullName: string, specialite: string, telephone: string, adress: string, cin: string, numeroIdentification : string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password, fullName, specialite, telephone, adress, cin, numeroIdentification  }, { withCredentials: true }).pipe(
      tap(() => {
      })
    );
  }

  setRole(role: string) {
    this.role = role;
    localStorage.setItem('role', role);
    this.userRoleSubject.next(role); 
  }

  getUserRole(): string {
    if (!this.role) {
      this.role = localStorage.getItem('role') || '';
    }
    return this.role;
  }
  
  setPatientId(id: number) {
    localStorage.setItem('patientId', id.toString());
  }

  getPatientId(): number {
    return Number(localStorage.getItem('patientId'));
  }

  isLoggedIn(): boolean {
    return !!this.role; 
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`http://localhost:3000/admin/utilisateurs`);
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.put(`http://localhost:3000/admin/users/${userId}/desactiver`, {});
  }
}
