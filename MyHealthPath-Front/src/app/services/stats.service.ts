import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GlobalStats {
  totalUsers: number;
  totalPatients: number;
  totalMedecins: number;
}

export interface MonthlyStat {
  month: string;
  patients: number;
  medecins: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private baseUrl = 'http://localhost:3000/admin/stats';

  constructor(private http: HttpClient) {}

  getGlobalStats(): Observable<{success: boolean, data: GlobalStats}> {
    return this.http.get<{success: boolean, data: GlobalStats}>(`${this.baseUrl}/global`);
  }

  getMonthlyStats(): Observable<{success: boolean, data: MonthlyStat[]}> {
    return this.http.get<{success: boolean, data: MonthlyStat[]}>(`${this.baseUrl}/monthly`);
  }
}
