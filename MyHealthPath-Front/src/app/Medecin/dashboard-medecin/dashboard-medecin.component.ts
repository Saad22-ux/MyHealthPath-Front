import { Component, OnInit, ViewChild  } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MedecinService } from '../../services/medecin.service';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ChartType } from 'chart.js';


@Component({
  selector: 'app-dashboard-medecin',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts()],
  templateUrl: './dashboard-medecin.component.html',
})
export class DashboardMedecinComponent implements OnInit {
  chartHeight = window.innerHeight * 0.9;
indicateurChartOptions: ChartOptions ={
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          family: "'Open Sans', sans-serif",
          size: 12
        },
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: '#013a63',
      titleFont: {
        family: "'Montserrat', sans-serif",
        size: 14
      },
      bodyFont: {
        family: "'Open Sans', sans-serif",
        size: 12
      },
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    y: {
      grid: {
        color: 'rgba(1, 58, 99, 0.1)'
      },
      ticks: {
        font: {
          family: "'Open Sans', sans-serif"
        },
        color: '#013a63'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: "'Open Sans', sans-serif"
        },
        color: '#013a63'
      }
    }
  },
  animation: {
  duration: 1000,
  easing: 'easeOutQuart' as 'easeOutQuart'
}
};

indicateurChartType: ChartType = 'bar'; 

indicateurChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Average',  // Seulement "Moyenne" comme légende
      data: [72, 68, 75, 78, 71, 70],  // Exemple de données moyennes
      backgroundColor: '#00b4d8',
      borderColor: '#0077b6',
      borderWidth: 2,
      borderRadius: 6
    }
  ]
};

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private medecinService: MedecinService) {}

  ngOnInit(): void {
    this.medecinService.getMoyennesIndicateurs().subscribe(res => {
      console.log('Résultat backend:', res);
      if (res.success) {
        const noms = res.data.map(d => d.nom);
        const moyennes = res.data.map(d => +d.moyenne);

        this.indicateurChartData.labels = res.data.map(d => d.nom);
        this.indicateurChartData.datasets[0].data = res.data.map(d => +d.moyenne);

        this.chart?.update();
      }
    });
  }
}
