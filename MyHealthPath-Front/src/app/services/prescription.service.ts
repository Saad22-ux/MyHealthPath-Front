import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  addPrescription(patientId: number, prescription: any) {
    return this.http.post(`${this.baseUrl}/add-prescription/${patientId}`, prescription, {withCredentials: true});
  }

  getPrescriptionDetails(prescriptionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-details/${prescriptionId}`);
  }

  getIndicateursBySpecialite() {
  return this.http.get<{ indicateurs: string[] }>(`http://localhost:3000/indicateurs-par-specialite/`,{ withCredentials: true });
}
}
