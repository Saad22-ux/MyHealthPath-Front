import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  
}
