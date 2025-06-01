import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PatientStatistics {
  patient: {
    fullName: string;
    id: number;
  };
  medicamentsPris: number;
  indicateursMesures: number;
  suiviMedicamentStats: any[];
  suiviIndicateurStats: any[];
}

export interface PatientProfile {
  id: number;
  UserId: number;
  fullName: string;
  email: string;
  genre: string;
  telephone: string,
  adress: string,
  cin: string,
  taille: number,
  poids: number,
  date_naissance: string;
}

export interface UpdatePatientProfileResponse {
  success: boolean;
  message: string;
  patient?: any;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:3000/get-patients';
  private apiUrl_create = 'http://localhost:3000/create-patient';

  constructor(private http: HttpClient) {}

  createPatient(patientData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl_create, patientData, { withCredentials: true });
  }

  getListPatients(): Observable <any>{
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  updateSubscription(patientId: number, isSubscribed: boolean): Observable<any> {
    const url = `${this.apiUrl}/${patientId}/${isSubscribed ? 'activate' : 'suspendre'}`;
    return this.http.post(url, {}, { withCredentials: true });
  }

  consultPatient(id: number): Observable<any>{
    return this.http.get(`http://localhost:3000/get-patients/${id}`, {});
  }

  deleteMedicament(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/medicaments/${id}`, { withCredentials: true });
  }
  
  deleteIndicateur(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/indicateurs/${id}`, { withCredentials: true });
  }

  getPatientStatistics(patientId: string, prescriptionId: string): Observable<PatientStatistics> {
    return this.http.get<PatientStatistics>(`${this.apiUrl}/${patientId}/${prescriptionId}/statistiques`);
  }

  updatePatient(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}/update`, data);
  }

getPatientProfile() {
  return this.http.get<any>('http://localhost:3000/profilePatient', {
    withCredentials: true
  });
}

  updatePatientProfile(updatedData: any): Observable<any> {
  return this.http.put(`http://localhost:3000/profilePatient/update`,updatedData,{ withCredentials: true }
  );
}
}
