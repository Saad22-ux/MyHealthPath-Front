import { Component, OnInit } from '@angular/core';
import { PatientService, PatientStatistics } from '../../services/patient.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  imports: [NgFor,NgIf,FormsModule,CommonModule],
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  patientId: string = '';
  prescriptionId: string = '';
  statistics?: PatientStatistics;
  loading = false;
  error: string | null = null;

  patientFullName: string = 'Unknown';

  constructor(private patientService: PatientService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('patientId');
      const preId =params.get('prescriptionId')
      if (id && preId) {
        this.patientId = id;
        this.prescriptionId = preId ?? '';
        this.loadStatistics(id, preId);
      }
    });
  }

  loadStatistics(patientId: string, prescriptionId: string) {
    this.error = null;
    this.loading = true;

    this.patientService.getPatientStatistics(patientId, prescriptionId).subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.patientFullName = stats.patient?.fullName || 'Unknown';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load statistics.';
        this.loading = false;
      }
    });
  }
}
