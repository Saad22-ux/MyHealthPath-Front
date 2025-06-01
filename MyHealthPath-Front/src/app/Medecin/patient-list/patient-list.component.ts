import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  imports: [NgIf,NgFor,RouterModule,CommonModule],
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  loading = true;
  error = '';

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.patients);

    this.patientService.getListPatients().subscribe({
      next: (res) => {
        this.patients = res.data;
        console.log(this.patients);
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
    next: (res) => {
      const patient = this.patients.find(p => p.id === patientId);
      if (patient) {
        patient.Medecins[0].Patient_Medecin_Link.isSubscribed = newStatus; // Update the status in the nested object
      }

      // Re-fetch the patient list to ensure the latest data
      this.refreshPatientList();
    },
    error: (err) => {
      console.error('Error updating subscription status:', err);
      alert('Failed to update subscription status');
    }
  });
}

refreshPatientList(): void {
  this.loading = true; // Show loading indicator
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
}
