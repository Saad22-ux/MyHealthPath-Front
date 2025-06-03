import { Component } from '@angular/core';
import { MedecinService } from '../../services/medecin.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-medecin',
  imports: [FormsModule],
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

  selectedPhoto?: File;

  constructor(private medecinService: MedecinService) {}

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
          password : '',
          specialite: (data.specialite || '').toLowerCase(),
          numeroIdentification: data.numeroIdentification || '',
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch profil';
        this.loading = false;
      }
    });
  }

  onPhotoSelected(event: any) {
    this.error = '';
    this.statusMessage = '';
    if (event.target.files && event.target.files.length > 0) {
      this.selectedPhoto = event.target.files[0];
    }
  }

  updateProfile() {
    if (this.loading) return;

    this.loading = true;
    this.error = '';
    this.statusMessage = '';

    this.medecinService.updateProfile(this.updatedData, this.selectedPhoto).subscribe({
      next: (response) => {
        this.statusMessage = response.message || 'Profil updated successfully';
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to update profil';
        this.loading = false;
      }
    });
  }
}
