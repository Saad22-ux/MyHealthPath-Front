import { Component, OnInit, ViewChild  } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { MedecinService } from '../../services/medecin.service';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-medecin',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts()],
  templateUrl: './dashboard-medecin.component.html',
})
export class DashboardMedecinComponent implements OnInit {
  public indicateurChartType: 'bar' = 'bar'; // ✅ fix ici
  public indicateurChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Moyenne' }]
  };
  public indicateurChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
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
