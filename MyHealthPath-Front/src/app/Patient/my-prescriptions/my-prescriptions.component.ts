import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrescriptionService } from '../../services/prescription.service';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-prescriptions',
  imports: [NgIf,NgFor,RouterModule],
  templateUrl: './my-prescriptions.component.html',
})
export class MyPrescriptionsComponent implements OnInit {
  prescriptions: any[] = [];

  constructor(
    private authService: AuthService,
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const patientId = this.authService.getPatientId(); // stored on login

    this.prescriptionService.consultPatient(patientId).subscribe({
      next: (data) => {
        console.log('Raw prescriptions:', data.Prescriptions);
        this.prescriptions = data.Prescriptions || []; // Make sure the backend includes this field
      },
      error: (error) => {
        console.error('Error fetching prescriptions:', error);
      }
    });
  }

get activePrescriptions(): any[] {
  return this.prescriptions.filter(p => p.isActive === true);
}


shouldShowViewButton(prescriptionId: number): boolean {
  const lastSubmission = localStorage.getItem(`lastJournalSubmission_${prescriptionId}`);
  if (!lastSubmission) return true;

  const now = new Date().getTime();
  const lastTime = new Date(lastSubmission).getTime();

  const hoursPassed = (now - lastTime) / (1000 * 60 * 60);
  return hoursPassed >= 24;
}


}
