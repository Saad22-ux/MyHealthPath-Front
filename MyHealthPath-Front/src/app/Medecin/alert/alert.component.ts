// alertes.component.ts
import { Component, OnInit } from '@angular/core';
import { AlerteService, Notification } from '../../services/alerte.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [NgIf,CommonModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent implements OnInit {
  alertes: Notification[] = [];
  medecinId: number = 123; // ici fixe ou récupère l'id du médecin connecté

  constructor(private alertService: AlerteService) {}

  ngOnInit(): void {
    this.chargerAlertes();
  }

  chargerAlertes() {
    this.alertService.getAlertes(this.medecinId).subscribe({
      next: (data: any) => {
        console.log('Alertes reçues:', data);
        this.alertes = data;
      },
      error: (err: any) => {
        console.error('Erreur chargement alertes:', err);
      }
    });
  }
}