import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:3000/get-patients';

  constructor(private http: HttpClient) {}


  getListPatients(): Observable <any>{
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  suspendPatient(id: number): Observable<any>{
    return this.http.post(`http://localhost:3000/get-patients/${id}/suspendre`, {});
  }

  activatePatient(id: number): Observable<any>{
    return this.http.post(`http://localhost:3000/get-patients/${id}/activate`, {});
  }

  consultPatient(id: number): Observable<any>{
    return this.http.get(`http://localhost:3000/get-patients/${id}`, {});
  }

  addMedicament(patientId: number, medicament: any) {
    return this.http.post(`http://localhost:3000/get-patients/${patientId}/medicaments`, medicament);
  }

  deleteMedicament(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/medicaments/${id}`, { withCredentials: true });
  }
  
  deleteIndicateur(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/indicateurs/${id}`, { withCredentials: true });
  }
}
