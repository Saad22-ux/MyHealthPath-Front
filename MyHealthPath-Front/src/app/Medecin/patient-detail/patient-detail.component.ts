import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  statusMessage = '';

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
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
      next: (res: any) => {
        console.log(res);
        this.patientDetails = res.data;
        this.statusMessage = res.message || 'Details loaded successfully';
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch patient details';
      }
    });
  }

  calculateAge(dateNaissance: string): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  togglePrescriptionStatus(prescription: any) {
    this.prescriptionService.updatePrescriptionStatus(prescription.id, !prescription.isActive).subscribe({
      next: (res) => {
        if (res.success) {
          prescription.isActive = !prescription.isActive;
          this.statusMessage = res.message || 'Status updated successfully';
        }
        setTimeout(() => this.statusMessage = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update prescription status';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }
}
