import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

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
      
      // Créer la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
      
      // Mettre à jour le contrôle du formulaire
      this.profileForm.patchValue({ photo: this.selectedFile });
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

    // Ajouter tous les champs sauf le fichier photo
    Object.keys(this.profileForm.controls).forEach(key => {
      if (key !== 'photo') {
        const value = this.profileForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    });

    // Ajouter le fichier photo s'il a été sélectionné
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.patientService.updatePatientProfile(formData).subscribe({
      next: (res: any) => {
        console.log('Réponse serveur:', res);
        this.successMsg = res.message || 'Profile updated successfully';
        this.loading = false;
        // Mettre à jour la prévisualisation si le serveur renvoie une nouvelle URL
        if (res.user?.photo) {
          // Construire une URL complète (ajoute le domaine + protocole)
          this.photoPreview = `http://localhost:3000/${res.user.photo}`;
        }

      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to update profile';
        this.loading = false;
      }
    });
  }
}