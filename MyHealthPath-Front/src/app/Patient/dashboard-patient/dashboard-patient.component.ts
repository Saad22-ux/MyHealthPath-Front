import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Enregistre les composants Chart.js nécessaires pour un graphique en barres
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-dashboard-patient',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  providers: [provideCharts()],
  templateUrl: './dashboard-patient.component.html',
  styleUrls: ['./dashboard-patient.component.css'] // Ajoutez cette ligne pour le CSS
})
export class DashboardPatientComponent implements OnInit {

  public barChartType: 'bar' = 'bar';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Moyenne des indicateurs',
        backgroundColor: '#2b9ed6',
        borderColor: '#1e88c7',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#2388c0'
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#2a6276',
          font: {
            family: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(42, 98, 118, 0.1)'
        },
        ticks: {
          color: '#2a6276',
          font: {
            family: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
            size: 12
          },
          precision: 0
        },
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#2a6276',
          font: {
            family: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
            size: 14,
            weight: '500'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#2b9ed6',
        titleFont: {
          size: 16,
          weight: 'bold',
          family: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
        },
        bodyFont: {
          size: 14,
          family: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return ` ${context.parsed.y} (moyenne)`;
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const patientId = 1;
    this.http.get<any>(`http://localhost:3000/statistiques/patient/${patientId}/indicateurs/moyennes`)
      .subscribe({
        next: (response) => {
          if (response.success && response.data.length > 0) {
            this.barChartData = {
              labels: response.data.map((item: any) => item.nom),
              datasets: [
                { 
                  data: response.data.map((item: any) => parseFloat(item.moyenne)),
                  label: 'Moyenne des indicateurs',
                  backgroundColor: '#2b9ed6',
                  borderColor: '#1e88c7',
                  borderWidth: 1,
                  borderRadius: 4,
                  hoverBackgroundColor: '#2388c0'
                }
              ]
            };
          }
        },
        error: (err) => {
          console.error('Erreur lors du chargement des données:', err);
        }
      });
  }
}