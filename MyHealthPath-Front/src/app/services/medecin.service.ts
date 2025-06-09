import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MedecinProfile {
  id: number;
  specialite: string;
  UserId: number;
  fullName: string;
  telephone: string,
  adress: string,
  cin: string,
  numeroIdentification: string,
  email: string,
  password: string,
  photo?: string;
  photoUrl?: string;
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

  updateProfile(updatedData: any, photoFile?: File): Observable<any> {
    const formData = new FormData();

    for (const key in updatedData) {
      if (updatedData.hasOwnProperty(key) && updatedData[key] != null) {
        formData.append(key, updatedData[key]);
      }
    }

    if (photoFile instanceof File) {
      formData.append('photo', photoFile);
    }

    return this.http.put(`http://localhost:3000/profileMedecin/update`, formData, {withCredentials: true,});
  }

  getMoyennesIndicateurs() {
    return this.http.get<{ success: boolean, data: { nom: string, moyenne: number }[] }>('http://localhost:3000/statistiques/indicateurs/moyennes');
  }
}
