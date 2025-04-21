import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-patient',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent {

  @Input() email = '';
  @Input() fullName = '';
  @Input() genre = '';
  @Input() date_naissance = '';
  submitted = false;
  
  statusMessage: string = '';
  isSuccess: boolean = true;
  validationErrors: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  addPatient(patientForm: any) {
    // Mark all fields as touched to trigger validation messages
    patientForm.form.markAllAsTouched();
    
    // Proceed with form submission if valid
    if (patientForm.valid) {
      this.authService.addPatient(this.email, this.fullName, this.genre, this.date_naissance).subscribe({
        next: () => {
          this.statusMessage = 'Patient added successfully';
          this.isSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (err) => {
          if (err.error && err.error.errors) {
            this.validationErrors = err.error.errors; // Set validation errors from the backend
          } else {
            this.statusMessage = 'Registration failed. Please try again.';
            setTimeout(() => {
              this.statusMessage = '';
            }, 1000);
            this.isSuccess = false;
          }
        }
      });
    }
    this.submitted = true;
    if (!this.email || !this.fullName || !this.genre || !this.date_naissance) {
      return;
    }
  }
}