import { Component } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private patientService: PatientService) {}

  rechercherPatient() {
    if (!this.cin) {
      this.message = 'Veuillez entrer un CIN.';
      return;
    }

    this.patientService.rechercherPatientParCIN(this.cin).subscribe({
      next: (res) => {
        this.patientInfo = res.patient;
        this.message = 'Patient trouvé.';
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
      },
      error: (err) => {
        this.message = err.error.message || 'Erreur lors du lien.';
      }
    });
  }
}
