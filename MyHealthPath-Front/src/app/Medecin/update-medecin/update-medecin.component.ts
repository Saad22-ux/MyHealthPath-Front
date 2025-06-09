import { Component } from '@angular/core';
import { MedecinService } from '../../services/medecin.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-medecin',
  imports: [FormsModule,NgIf],
  templateUrl: './update-medecin.component.html',
  styleUrls: ['./update-medecin.component.css']
})
export class UpdateMedecinComponent {
  updatedData = {
    fullName: '',
    email: '',
    telephone: '',
    adress: '',
    password: '',
    cin: '',
    specialite: '',
    numeroIdentification: '',
  };

  statusMessage = '';
  error = '';
  loading = false;

  selectedPhoto: File | null = null;

  photoPreview: string | ArrayBuffer | null = null;

  constructor(private medecinService: MedecinService, private router: Router) {}

ngOnInit() {
  this.loading = true;
  this.medecinService.getMedecinProfile().subscribe({
    next: (data) => {
      this.updatedData = {
        fullName: data.fullName || '',
        email: data.email || '',
        telephone: data.telephone || '',
        adress: data.adress || '',
        cin: data.cin || '',
        password: '',
        specialite: (data.specialite || '').toLowerCase(),
        numeroIdentification: data.numeroIdentification || '',
      };
      
      if (data.photoUrl) {
        const baseUrl = 'http://localhost:3000';
        this.photoPreview = `${baseUrl}/${data.photoUrl}`;
      }


      this.loading = false;
    },
    error: (err) => {
      this.error = err.error?.message || 'Failed to fetch profil';
      this.loading = false;
    }
  });
}

onPhotoSelected(event: Event) {
  this.error = '';
  this.statusMessage = '';
  
  const input = event.target as HTMLInputElement;
  
  if (input.files && input.files.length > 0) {
    this.selectedPhoto = input.files[0];

    if (!this.selectedPhoto.type.match('image.*')) {
      this.error = 'Seules les images sont acceptées';
      this.selectedPhoto = null;
      this.photoPreview = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.photoPreview = e.target?.result ?? null;
    };
    reader.readAsDataURL(this.selectedPhoto);
  } else {
    this.selectedPhoto = null;
  }
}

  updateProfile() {
    if (this.loading) return;

    this.loading = true;
    this.error = '';
    this.statusMessage = '';

    const photo = this.selectedPhoto instanceof File ? this.selectedPhoto : undefined;

    this.medecinService.updateProfile(this.updatedData, photo).subscribe({
      next: (response) => {
        this.statusMessage = response.message || 'Profil updated successfully';
        setTimeout(() => {
          this.router.navigate(['/profileMedecin']);
        }, 2000);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to update profil';
        this.loading = false;
      }
    });
  }
}
