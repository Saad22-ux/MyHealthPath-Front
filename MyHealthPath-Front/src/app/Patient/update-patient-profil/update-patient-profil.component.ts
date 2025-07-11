import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-patient-profil',
  standalone: true,
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
  photoPreview: string | ArrayBuffer = 'assets/default-avatar.png';

  constructor(private patientService: PatientService, private fb: FormBuilder, private router: Router) {
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
        this.profileForm.get('password')?.reset();
        if (res.photo) {
          this.photoPreview = `http://localhost:3000/${res.photo}`;
        } else {
          this.photoPreview = 'assets/default-avatar.png';
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to load profile';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
      this.profileForm.get('photo')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const formData = new FormData();

    Object.keys(this.profileForm.controls).forEach(key => {
      const value = this.profileForm.get(key)?.value;
      if (key === 'password') {
        if (value && value.trim()) {
          formData.append('password', value);
        }
      } else if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.patientService.updatePatientProfile(formData).subscribe({
      next: (res: any) => {
        this.successMsg = res.message || 'Profile updated successfully';
        this.loading = false;
        if (res.user?.photo) {
          this.photoPreview = `http://localhost:3000/${res.user.photo}`;
        }
        setTimeout(() => {
          this.router.navigate(['/profilePatient']);
        }, 2000);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to update profile';
        this.loading = false;
      }
    });
  }
}