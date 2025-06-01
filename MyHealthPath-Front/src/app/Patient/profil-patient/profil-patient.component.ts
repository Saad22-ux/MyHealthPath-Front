import { Component, OnInit } from '@angular/core';
import { PatientService, PatientProfile } from '../../services/patient.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-patient',
  imports: [NgIf],
  templateUrl: './profil-patient.component.html',
  styleUrl: './profil-patient.component.css'
})
export class ProfilPatientComponent implements OnInit{
  profile?: PatientProfile;
  errorMessage: string = '';

  constructor(private patientService: PatientService, private router: Router) {}

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

  calculateAge(dateNaissance: string): number {
  const birthDate = new Date(dateNaissance);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


redirectToUpdate() {
    this.router.navigate(['/profilePatient/update']);
  }
}
