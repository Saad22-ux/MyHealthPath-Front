import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth.service';
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
          drawTicks: true
        },
        ticks: {
          color: '#2a6276',
          font: {
            family: "'Poppins', 'Segoe UI', sans-serif",
            size: 12,
            weight: '500'
          }
        },
        border: {
          display: true,
          color: 'rgba(42, 98, 118, 0.2)'
        }
      },
      y: {
        grid: {
          color: 'rgba(42, 98, 118, 0.08)',
          drawTicks: false
        },
        ticks: {
          color: '#2a6276',
          font: {
            family: "'Poppins', 'Segoe UI', sans-serif",
            size: 12
          },
          precision: 0
        },
        min: 0,
        border: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(43, 158, 214, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Poppins', 'Segoe UI', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Poppins', 'Segoe UI', sans-serif"
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return ` ${context.parsed.y?.toFixed(1)} (moyenne)`;
          },
          title: (items) => {
            return items[0].label;
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: 'bottom',
        backgroundColor: 'rgba(43, 158, 214, 0.7)',
        hoverBackgroundColor: 'rgba(30, 136, 199, 0.9)'
      }
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    }
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const patientId = this.authService.getPatientId();
    if (patientId) {
      this.loadGraph(patientId);
    }
}


  loadGraph(patientId: number) {
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