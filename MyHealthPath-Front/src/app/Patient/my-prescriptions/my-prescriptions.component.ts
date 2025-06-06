import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { PrescriptionService } from '../../services/prescription.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-prescriptions',
  imports: [NgIf,NgFor,RouterModule,CommonModule],
  standalone: true,
  templateUrl: './my-prescriptions.component.html',
  styleUrls: ['./my-prescriptions.component.css']
})
export class MyPrescriptionsComponent implements OnInit {
  prescriptions: any[] = [];
  error = '';

  constructor(
    private authService: AuthService,
    private prescriptionService: PrescriptionService,
  ) {}

  ngOnInit(): void {
    const patientId = this.authService.getPatientId();
    this.prescriptionService.consultPatient(patientId).subscribe({
      next: (data) => {
        this.prescriptions = data.data?.Prescriptions || [];
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load prescriptions';
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
