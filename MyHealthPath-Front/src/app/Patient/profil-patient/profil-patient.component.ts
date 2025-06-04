import { Component, OnInit } from '@angular/core';
import { PatientService, PatientProfile } from '../../services/patient.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-patient',
  imports: [NgIf],
  templateUrl: './profil-patient.component.html',
  styleUrls: ['./profil-patient.component.css']
})
export class ProfilPatientComponent implements OnInit{
  profile?: PatientProfile;
  errorMessage: string = '';
  loading = false;

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();

  }

  loadProfile() {
    this.errorMessage = '';
    this.loading = true;
    this.patientService.getPatientProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load patient';
        this.loading = false;
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

  getPhotoUrl(photoPath: string): string {
    return photoPath.startsWith('http') ? photoPath : `http://localhost:3000/${photoPath}`;
  }

  redirectToUpdate() {
      this.router.navigate(['/profilePatient/update']);
  }
}
