import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { PatientService } from '../services/patient.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls : ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  patientId: string | null = null;

  prescriptions: any[] = [] ;
  loading = true;
  error = '';

  constructor(private authService: AuthService, private router: Router, private patientService: PatientService) {}

  ngOnInit(): void {
    // Check if the user is authenticated when the dashboard loads
    if (!this.authService.isAuthenticated()) {
      // Redirect to login if the user is not authenticated
      this.router.navigate(['/login']);
    }

    this.patientId = localStorage.getItem('patientId');

    if (this.patientId) {
      const patientIdNum = Number(this.patientId); // Convert to number

      this.patientService.consultPatient(patientIdNum).subscribe({
        next: (res) => {
          console.log('Patient', this.patientId, 'prescriptions:', res);
          this.prescriptions = res.Prescriptions || [];
          this.loading = false;
        },
        error: (err) => {
          console.error(`Failed to fetch prescriptions for patient ${this.patientId}`, err);
          this.prescriptions = [];
          this.error = 'Failed to load prescriptions.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No patient ID found.';
      this.loading = false;
    }
  }

  goToPrescriptions() {
  this.router.navigate(['/my-prescriptions']);
}

goToSuiviMedical(){
  this.router.navigate(['/suivi-dashboard']);
}

goToProfil(){
  this.router.navigate(['/profilePatient']);
}

goToNotification(){
  this.router.navigate(['/notifications']);
}
}
