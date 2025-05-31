import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PrescriptionService } from '../../services/prescription.service';

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
    private router: Router,
    private prescriptionService: PrescriptionService
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

  togglePrescriptionStatus(prescription: any) {
  this.prescriptionService.updatePrescriptionStatus(prescription.id, !prescription.isActive).subscribe({
    next: (res) => {
      if (res.success) {
        prescription.isActive = !prescription.isActive;
      } else {
        alert('Erreur : ' + res.message);
      }
    },
    error: (err) => {
      console.error(err);
      alert('Erreur serveur');
    }
  });
}
}
