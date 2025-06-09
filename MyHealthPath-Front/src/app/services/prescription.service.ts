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

  getPrescriptions(id: number): Observable<any>{
    return this.http.get(`http://localhost:3000/patients/${id}/`, {});
  }

  updatePrescription(prescriptionId: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/modify-perscription/${prescriptionId}`, data, { withCredentials: true });
  }

  updatePrescriptionStatus(prescriptionId: number, isActive: boolean): Observable<any> {
    const url = `${this.baseUrl}/${isActive ? 'activer-prescription' : 'desactiver-prescription'}/${prescriptionId}`;
    return this.http.put(url, {}, { withCredentials: true });
  }

  createJournal(patientId: number, data: any) {
    return this.http.post(`http://localhost:3000/journal/${patientId}`, data);
  }

  updateJournal(patientId: number, data: any) {
    return this.http.put(`http://localhost:3000/journal/update/${patientId}`, data);
  }

  getJournalByPrescription(prescriptionId: number): Observable<any> {
    return this.http.get(`http://localhost:3000/prescriptions/${prescriptionId}/journaux`);
  }
}
