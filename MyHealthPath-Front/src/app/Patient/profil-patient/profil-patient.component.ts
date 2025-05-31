import { Component, OnInit } from '@angular/core';
import { PatientService, PatientProfile } from '../../services/patient.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profil-patient',
  imports: [NgIf],
  templateUrl: './profil-patient.component.html',
  styleUrl: './profil-patient.component.css'
})
export class ProfilPatientComponent implements OnInit{
  profile?: PatientProfile;
  errorMessage: string = '';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getPatientProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du profil.';
        console.error(error);
      }
    });
  }
}
