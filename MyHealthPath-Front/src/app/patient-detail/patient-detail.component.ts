import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  imports: [NgIf,NgFor]
})
export class PatientDetailComponent implements OnInit {
  patientId!: number;
  patientDetails: any = {};
  error: string = '';

  constructor(private route: ActivatedRoute, private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    // Get patient id from route parameters
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch patient details
    this.patientService.consultPatient(this.patientId).subscribe({
      next: (res) => {
        this.patientDetails = res;
      },
      error: (err) => {
        this.error = 'Failed to fetch patient details';
      }
    });
  }
}
