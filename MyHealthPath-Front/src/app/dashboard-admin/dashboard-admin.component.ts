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
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {

  // Graphique global users (bar)
  public globalChartType: 'bar' = 'bar';
  public globalChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Users', 'Patients', 'Doctors'],
    datasets: [
      { data: [], label: 'Comptes' }
    ]
  };
  public globalChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(33, 37, 41, 0.98)',
      bodyColor: '#f8f9fa',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: () => '', // Supprime le titre
        label: (context) => `${context.dataset.label}: ${context.raw}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6c757d' }
    },
    y: {
      grid: { color: 'rgba(0, 0, 0, 0.05)' },
      ticks: { color: '#6c757d' }
    }
  },
  elements: {
    bar: {
      borderRadius: 6,
      backgroundColor: [
        'rgba(13, 110, 253, 0.7)',
        'rgba(32, 201, 151, 0.7)',
        'rgba(111, 66, 193, 0.7)'
      ],
      hoverBackgroundColor: [
        'rgba(13, 110, 253, 1)',
        'rgba(32, 201, 151, 1)',
        'rgba(111, 66, 193, 1)'
      ],
      borderWidth: 0
    }
  }
};

public monthlyChartOptions: ChartConfiguration<'line'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#212529',
        font: {
          size: 13
        },
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      enabled: true, // S'assurer que les tooltips sont activés
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      display: true, // S'assurer que l'axe X est visible
      title: {
        display: true,
        text: 'Months',
        color: '#6c757d'
      }
    },
    y: {
      display: true, // S'assurer que l'axe Y est visible
      title: {
        display: true,
        text: 'Number of registrations',
        color: '#6c757d'
      },
      beginAtZero: true // Commencer à zéro pour une meilleure lisibilité
    }
  },
  interaction: {
    intersect: false,
    mode: 'nearest'
  }
};

  // Graphique mensuel (ligne)
  public monthlyChartType: 'line' = 'line';
  public monthlyChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Patients', fill: false, borderColor: 'blue' },
      { data: [], label: 'Doctors', fill: false, borderColor: 'green' }
    ]
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
      this.globalChartData = {
        ...this.globalChartData,
        datasets: [{
          ...this.globalChartData.datasets[0],
          data: [
            res.data.totalUsers,
            res.data.totalPatients,
            res.data.totalMedecins
          ]
        }]
      };
    }
  });
}

private loadMonthlyStats() {
  this.statsService.getMonthlyStats().subscribe(res => {
    if (res.success) {
      this.monthlyChartData = {
        labels: res.data.map(m => m.month),
        datasets: [
          {
            ...this.monthlyChartData.datasets[0],
            data: res.data.map(m => m.patients)
          },
          {
            ...this.monthlyChartData.datasets[1],
            data: res.data.map(m => m.medecins)
          }
        ]
      };
    }
  });
}
}
