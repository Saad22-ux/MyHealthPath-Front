import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  imports: [NgIf,NgFor,RouterModule,CommonModule,MatIconModule,MatButtonModule],
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  loading = true;
  error = '';
  statusMessage = '';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(){
    this.patientService.getListPatients().subscribe({
      next: (res: any) => {
        this.patients = res.data;
        console.log('Patients:', res.data);
        this.statusMessage = res.message || 'Fetched successeful';
        this.error = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error fetching patients';
        this.loading = false;
      }
    });
  }
  
  refreshPatientList(): void {
    this.loading = true;
    this.loadPatients();
  }

  toggleSubscription(patientId: number, currentStatus: boolean): void {
    const newStatus = !currentStatus;
    this.patientService.updateSubscription(patientId, newStatus).subscribe({
      next: (res) => {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
          patient.Medecins[0].Patient_Medecin_Link.isSubscribed = newStatus;
        }
        this.statusMessage = res.message || 'Status updated successfully';
        setTimeout(() => {
          this.statusMessage = '';
          this.error = '';
        },3000);
        this.refreshPatientList();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update subscription status';
      }
    });
  }
}
