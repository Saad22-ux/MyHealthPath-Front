import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-patient-list',
  standalone: true,
  templateUrl: './suivi-dashboard.component.html',
  imports: [NgIf,NgFor,RouterModule,CommonModule],
  styleUrls: ['./suivi-dashboard.component.css']
})
export class SuiviDashboard implements OnInit {
  patients: any[] = [];
  prescriptionsMap: { [patientId: number]: any[] } = {};
  loading = true;
  error = '';
  statusMessage = '';

  userRole: string = '';

  constructor(private patientService: PatientService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {  
    this.userRole = this.authService.getUserRole();

    if (this.userRole === 'patient'){
      const patientId = Number(localStorage.getItem('patientId'));
      if (patientId) {
        this.patientService.consultPatient(patientId).subscribe({
          next: (res) => {
            this.patients = [res.data];
            this.prescriptionsMap[patientId] = res.data?.Prescriptions || [];
            this.loading = false;
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to load your prescriptions';
            this.loading = false;
          }
        });
      }
    }else {
      this.patientService.getListPatients().subscribe({
        next: (res) => {
          this.patients = res.data;
          this.loading = false;

          for (let patient of this.patients) {
            this.patientService.consultPatient(patient.id).subscribe({
              next: (res) => {
                this.prescriptionsMap[patient.id] = res.data.Prescriptions || [];
              },
              error: (err) => {
                this.prescriptionsMap[patient.id] = [];
                this.error = err.error?.message || 'Failed to load your prescriptions';
              }
            });
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Error fetching patients';
          this.loading = false;
        }
      });
    }
  }

  refreshPatientList(): void {
    this.loading = true;
    this.patientService.getListPatients().subscribe({
      next: (res) => {
        this.patients = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error fetching patients';
        this.loading = false;
      }
    });
  }

  toggleSubscription(patientId: number, currentStatus: boolean): void {
    const newStatus = !currentStatus;
    this.patientService.updateSubscription(patientId, newStatus).subscribe({
      next: () => {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
          patient.Medecins[0].Patient_Medecin_Link.isSubscribed = newStatus;
        }
        this.refreshPatientList();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error updating subscription';
      }
    });
  }
}
