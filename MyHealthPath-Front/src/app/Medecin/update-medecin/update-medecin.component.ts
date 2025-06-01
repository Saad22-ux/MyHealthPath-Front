import { Component } from '@angular/core';
import { MedecinService } from '../../services/medecin.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-medecin',
  imports: [FormsModule],
  templateUrl: './update-medecin.component.html',
  styleUrl: './update-medecin.component.css'
})
export class UpdateMedecinComponent {
  updatedData = {
    fullName: '',
    email: '',
    telephone: '',
    adress: '',
    cin: '',
    specialite: '',
    numeroIdentification: '',
    // other fields you want to update
  };

  selectedPhoto?: File;

  constructor(private medecinService: MedecinService) {}

  ngOnInit() {
    this.medecinService.getMedecinProfile().subscribe({
      next: (data) => {
        this.updatedData = {
          fullName: data.fullName || '',
          email: data.email || '',
          telephone: data.telephone || '',
          adress: data.adress || '',
          cin: data.cin || '',
          specialite: (data.specialite || '').toLowerCase(),
          numeroIdentification: data.numeroIdentification || '',
        };
        console.log('Specialité chargée:', this.updatedData.specialite);
      },
      error: (err) => {
        console.error('Error fetching profile data', err);
      }
    });
    
  }

  onPhotoSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedPhoto = event.target.files[0];
    }
  }

  updateProfile() {
     console.log('updateProfile called');
    this.medecinService.updateProfile(this.updatedData, this.selectedPhoto).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        // maybe show a success message or redirect
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        // handle error, show feedback to user
      }
    });
  }

}
