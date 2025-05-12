import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule]
})
export class PatientDetailComponent implements OnInit {
  patientId!: number;
  patientDetails: any = {};
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.patientId = +id;
        this.loadPatientDetails();
      }
    });
  }

  loadPatientDetails() {
    this.patientService.consultPatient(this.patientId).subscribe({
      next: (res) => {
        this.patientDetails = res;
      },
      error: () => {
        this.error = 'Failed to fetch patient details';
      }
    });
  }
}
