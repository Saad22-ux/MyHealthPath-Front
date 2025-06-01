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

  constructor(private medecinService: MedecinService, private router: Router) {}

  ngOnInit(): void {
    this.medecinService.getMedecinProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du profil.';
        console.error(error);
      }
    });
  }

  redirectToUpdate() {
    this.router.navigate(['/profileMedecin/update']);
  }
}
