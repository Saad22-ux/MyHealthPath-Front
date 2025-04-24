import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient',
  imports: [NgFor,NgIf],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit{
  patients: any[]= [];

  error = ';'

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.patientService.getListPatients().subscribe({
      next: (res) => {
        this.patients = res.data;
      },
      error: (err) => {
        this.error = 'Failed to fetch patients';
      }
    });
  }

  consult(patientId: number): void {
    this.router.navigate(['/patient', patientId]); // Navigate to the detail page
  }

  prescribe(patientId: number): void {
    this.router.navigate(['/prescription', patientId]); // Navigate to the detail page
  }

  suspend(userId: number){
    this.patientService.suspendPatient(userId).subscribe({
      next: (res) => {
        console.log('Suspended:', res);
        // Refresh list
        this.ngOnInit();
      },
      error: (err) => console.error('Suspend error:', err)
    });
  }

  activate(userId: number){
    this.patientService.activatePatient(userId).subscribe({
      next: (res) => {
        console.log('Activated:', res);
        // Refresh list
        this.ngOnInit();
      },
      error: (err) => console.error('Activate error:', err)
    });
  }
}
