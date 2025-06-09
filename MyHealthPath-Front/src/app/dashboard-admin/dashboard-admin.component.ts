import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../services/stats.service';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { HttpClientModule } from '@angular/common/http';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement, Legend, Tooltip, Title } from 'chart.js';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  providers: [provideCharts()],
  templateUrl: './dashboard-admin.component.html'
})
export class DashboardAdminComponent implements OnInit {

  // Graphique global users (bar)
  public globalChartType: 'bar' = 'bar';
  public globalChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Utilisateurs totaux', 'Patients', 'Médecins'],
    datasets: [
      { data: [], label: 'Comptes' }
    ]
  };
  public globalChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  // Graphique mensuel (ligne)
  public monthlyChartType: 'line' = 'line';
  public monthlyChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Patients', fill: false, borderColor: 'blue' },
      { data: [], label: 'Médecins', fill: false, borderColor: 'green' }
    ]
  };
  public monthlyChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  constructor(private statsService: StatsService) {
    Chart.register(
      BarController,
      BarElement,
      CategoryScale,
      LinearScale,
      LineController,
      LineElement,
      PointElement,
      Legend,
      Tooltip,
      Title
    );
  }

  ngOnInit(): void {
    this.loadGlobalStats();
    this.loadMonthlyStats();
  }

  private loadGlobalStats() {
    this.statsService.getGlobalStats().subscribe(res => {
      if (res.success) {
        this.globalChartData.datasets[0].data = [
          res.data.totalUsers,
          res.data.totalPatients,
          res.data.totalMedecins
        ];
      }
    });
  }

  private loadMonthlyStats() {
    this.statsService.getMonthlyStats().subscribe(res => {
      if (res.success) {
        console.log("Resultat:", res);
        const months = res.data.map(m => m.month);
        const patients = res.data.map(m => m.patients);
        const medecins = res.data.map(m => m.medecins);

        this.monthlyChartData.labels = months;
        this.monthlyChartData.datasets[0].data = patients;
        this.monthlyChartData.datasets[1].data = medecins;
      }
    });
  }
}
