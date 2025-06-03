import { Component, OnInit } from '@angular/core';
import { MedecinService } from '../services/medecin.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-unapproved-medecins',
  templateUrl: './unapproved-medecins.component.html',
  styleUrls: ['./unapproved-medecins.component.css'],
  imports: [NgFor]
})
export class UnapprovedMedecinsComponent implements OnInit {
  medecins: any[] = [];

  statusMessage: string = '';
  isSuccess: boolean = true;

  constructor(private medecinService: MedecinService) {}

  ngOnInit(): void {
    this.loadMedecins();;
  }

  loadMedecins() {
  this.medecinService.getUnapprovedMedecins().subscribe({
    next: (data) => {
      this.medecins = data;
      this.statusMessage = '';
      this.isSuccess = true;
    },
    error: (err) => {
      this.statusMessage = err.error?.message || 'Failed to load pending doctors. Please try again later.';
      this.isSuccess = false;
    }
  });
}

  approve(userId: number) {
    this.medecinService.approveMedecin(userId).subscribe({
      next: (response: any) => {
        this.statusMessage = response.message;
        this.isSuccess = true;
        this.ngOnInit();
      },
      error: (err) => {
        this.statusMessage = err.error?.message || 'Failed to approve médecin.';
        this.isSuccess = false;
      }
    });
  }
}
