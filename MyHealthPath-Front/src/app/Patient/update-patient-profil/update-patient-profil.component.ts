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

  selectedFile: File | null = null;


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

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


  onSubmit(): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const formData = new FormData();

    Object.keys(this.profileForm.controls).forEach(key => {
      if (key !== 'photo') {
        const value = this.profileForm.get(key)?.value;
        if (value) {
          formData.append(key, value);
        }
      }
    });

    if (this.profileForm.get('password')?.value) {
      formData.append('password', this.profileForm.get('password')?.value);
    }

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.patientService.updatePatientProfile(formData).subscribe({
      next: (res: any) => {
        this.successMsg = res.message || 'Profil updated successfully';
        this.loading = false;
        this.selectedFile = null;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to update';
        this.loading = false;
      }
    });
  }
}
