import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard-patient',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgChartsModule],
  templateUrl: './dashboard-patient.component.html'
})
export class DashboardPatientComponent implements OnInit {

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Moyenne des indicateurs' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const patientId = 1; // à remplacer dynamiquement si besoin
    this.http.get<any>(`http://localhost:3000/statistiques/patient/${patientId}/indicateurs/moyennes`)
      .subscribe(response => {
        if (response.success) {
          this.barChartData.labels = response.data.map((item: any) => item.nom);
          this.barChartData.datasets[0].data = response.data.map((item: any) => parseFloat(item.moyenne));
        }
      });

      console.log(NgChartsModule);
  }
}
