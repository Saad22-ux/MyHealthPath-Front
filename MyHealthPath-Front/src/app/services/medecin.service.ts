import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MedecinProfile {
  id: number;
  specialite: string;
  UserId: number;
  fullName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private apiUrl = 'http://localhost:3000/pending-medecins';

  constructor(private http: HttpClient) {}

  getUnapprovedMedecins(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  approveMedecin(id: number): Observable<any> {
    return this.http.post(`http://localhost:3000/approve-medecin/${id}`, {});
  }

  getMedecinProfile(): Observable<MedecinProfile> {
  return this.http.get<MedecinProfile>('http://localhost:3000/profileMedecin', {
    withCredentials: true
  });
}
  
}
