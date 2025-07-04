import { Component } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lier-patients',
  imports: [NgIf,FormsModule],
  templateUrl: './lier-patients.component.html',
  styleUrl: './lier-patients.component.css'
})
export class LierPatientsComponent {

  cin: string = '';
  patientInfo: any = null;
  message: string = '';

  constructor(private patientService: PatientService, private router: Router) {}

  rechercherPatient() {
    if (!this.cin) {
      this.message = 'Veuillez entrer un CIN.';
      return;
    }

    this.patientService.rechercherPatientParCIN(this.cin).subscribe({
      next: (res) => {
        this.patientInfo = res.patient;
        this.message = 'Patient trouvé.';
        setTimeout(() => {
          this.message = '';
        }, 2000);
      },
      error: (err) => {
        this.patientInfo = null;
        this.message = err.error.message || 'Erreur lors de la recherche.';
      }
    });
  }

  lierPatient() {
    this.patientService.lierPatientAuMedecin(this.cin).subscribe({
      next: (res) => {
        this.message = res.message;
        setTimeout(() => {
          this.router.navigate(['/patient-list']);
        }, 2000);
      },
      error: (err) => {
        this.message = err.error.message || 'Erreur lors du lien.';
        setTimeout(() => {
          this.router.navigate(['/patient-list']);
        }, 2000)
      }
    });
  }

  getPhotoUrl(): string {
    if (this.patientInfo && this.patientInfo.user.photo) {
      return 'http://localhost:3000/' + this.patientInfo.user.photo; 
    }
    return 'assets/default-photo.png';
  }
}
