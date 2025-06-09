import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  PatientId: number;
  MedecinId: number;
  createdAt: string;
  Patient?: { id: number; nom: string; prenom: string };
}

@Injectable({
  providedIn: 'root'
})
export class AlerteService {
  private apiUrl = 'http://localhost:3000/notifications';

  constructor(private http: HttpClient) {}

  getAlertes(medecinId: number): Observable<Notification[]> {
    const params = new HttpParams().set('medecinId', medecinId.toString());
    return this.http.get<Notification[]>(`${this.apiUrl}/alerte`, { params });
  }
}
