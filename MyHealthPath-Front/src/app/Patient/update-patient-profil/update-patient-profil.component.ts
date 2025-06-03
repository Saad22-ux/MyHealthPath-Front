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
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.patientService.getPatientProfile().subscribe({
      next: (res: any) => {
        this.profileForm.patchValue(res);
        this.successMsg = res.message || 'Profil fetched successfully';
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to load profil';
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const formValue = { ...this.profileForm.value };
    if (!formValue.password) {
      delete formValue.password;
    }

    this.patientService.updatePatientProfile(this.profileForm.value).subscribe({
      next: (res: any) => {
        this.successMsg = res.message || 'Profil updated successfully';
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to update';
        this.loading = false;
      }
    });
  }
}
