import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-update-patient-profil',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './update-patient-profil.component.html',
  styleUrls: ['./update-patient-profil.component.css']
})
export class UpdatePatientProfilComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private patientService: PatientService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: [''],
      email: [''],
      telephone: [''],
      adress: [''],
      genre: [''],
      date_naissance: [''],
      taille: [''],
      poids: [''],
      photo: [''],
      cin: [''],
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadProfile();  // <-- load profile on init
  }

  loadProfile(): void {
  this.patientService.getPatientProfile().subscribe({
    next: (res) => {
      // Patch the form directly with the response object
      this.profileForm.patchValue(res);
      console.log('Form after patch:', this.profileForm.value);
    },
    error: (err) => {
      this.errorMsg = 'Erreur lors du chargement du profil.';
      console.error(err);
    }
  });
}


  onSubmit(): void {
    console.log('onSubmit called');
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.patientService.updatePatientProfile(this.profileForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMsg = res.message;
        } else {
          this.errorMsg = res.message || 'Erreur lors de la mise à jour.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Erreur serveur.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
