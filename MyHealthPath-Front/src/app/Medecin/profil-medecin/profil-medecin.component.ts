import { Component, OnInit } from '@angular/core';
import { MedecinService, MedecinProfile } from '../../services/medecin.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-medecin',
  imports: [NgIf],
  templateUrl: './profil-medecin.component.html',
  styleUrls: ['./profil-medecin.component.css']
})
export class ProfilMedecinComponent implements OnInit{

  profile?: MedecinProfile;
  errorMessage: string = '';
  loading = true;

  constructor(private medecinService: MedecinService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.errorMessage = '';
    this.loading = true;
    this.medecinService.getMedecinProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  redirectToUpdate() {
    this.router.navigate(['/profileMedecin/update']);
  }
}
