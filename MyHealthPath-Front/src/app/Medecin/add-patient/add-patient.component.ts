import { Component } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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

  constructor(private patientService: PatientService, private router: Router) {}

  onSubmit(patientForm: NgForm) {
    if (!patientForm.valid) {
      this.message = 'Please fill in all required fields correctly.';
      this.messageType = 'error';
      return;
    }

    const patientData = this.patient;
    this.message = '';

    this.patientService.createPatient(patientData).subscribe(
      (response) => {
        this.message = response.message || 'Patient created successfully';
        this.messageType = 'success';

        setTimeout(() => {
          this.router.navigate(['/dashboard-medecin']);
        }, 2000);
      },
      (error) => {
        this.message = error.error.message || 'Error creating patient';
        setTimeout(() => {
          this.message = '';
        }, 2000);
      }
    );
  }
}

