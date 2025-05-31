import { Component, OnInit } from '@angular/core';
import { PatientService, PatientStatistics } from '../../services/patient.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  imports: [NgFor,NgIf,FormsModule,CommonModule],
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  patientId: string = '';  // you can bind this to an input or get it from route params
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
      } else {
        this.error = 'No patient ID provided in URL.';
      }
    });
  }

  loadStatistics(patientId: string, prescriptionId: string) {
    this.error = null;
    this.loading = true;

    console.log('Calling API with:', patientId, prescriptionId);
    this.patientService.getPatientStatistics(this.patientId, this.prescriptionId).subscribe({
      next: (stats) => {
        console.log('API response:', stats);
        this.statistics = stats;
        this.patientFullName = stats.patient?.fullName || 'Unknown';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load statistics.';
        console.error('HTTP error:', err);
        this.loading = false;
      }
    });
  }
}
