import { Component } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
})
export class AddPatientComponent {
  patient = {
    cin: '',
    fullName: '',
    email: '',
    telephone: '',
    adress: '',
    genre: '',
    date_naissance: '',
    taille: '',
    poids: '',
  };

  message: string = '';
  messageType: 'success' | 'error' = 'success';
  validationErrors: any = {};

  constructor(private patientService: PatientService, private router: Router) {}

  onSubmit() {
    const patientData = this.patient;

    this.validationErrors = {};
    this.message = '';
    
    this.patientService.createPatient(patientData).subscribe(
      (response) => {
        this.message = response.message || 'Patient created successfully';
        this.messageType = 'success';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      (error) => {
        this.messageType = 'error';
        if (error.error) {
          this.message = error.error.message || 'Error creating patient';
          if (error.error.errors) {
            this.validationErrors = error.error.errors;
          }
        }
        setTimeout(() => {
          this.message = '';
        },2000);
      }
    );
  }
}

