import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-prescription',
  imports: [NgIf,NgFor],
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']

})
export class PrescriptionComponent implements OnInit{

  patientId!: number;
  patientDetails: any = {};
  error: string = '';

  constructor(private route: ActivatedRoute, private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    // Get patient id from route parameters
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch patient details
    this.patientService.consultPatient(this.patientId).subscribe({
      next: (res) => {
        this.patientDetails = res;
      },
      error: (err) => {
        this.error = 'Failed to fetch patient details';
      }
    });
  }

  goToAddMedication(): void {
    this.router.navigate([`/add-medication`, this.patientId]);
  }
  

  deleteMedicament(medicamentId: number): void {
    this.patientService.deleteMedicament(medicamentId).subscribe({
      next: (res) => {
        // Filter out the deleted medicament from the list
        this.patientDetails.Medicaments = this.patientDetails.Medicaments.filter(
          (med: any) => med.id !== medicamentId
        );
      },
      error: (err) => {
        this.error = 'Failed to delete medicament';
        setTimeout(() => {
          this.error = '';
        }, 1000);
      }
    });
  }

  deleteIndicateur(indicateurId: number): void {
    this.patientService.deleteIndicateur(indicateurId).subscribe({
      next: (res) => {
        // Filter out the deleted medicament from the list
        this.patientDetails.Indicateurs = this.patientDetails.Indicateurs.filter(
          (ind: any) => ind.id !== indicateurId
        );
      },
      error: (err) => {
        this.error = 'Failed to delete indicator';
        setTimeout(() => {
          this.error = '';
        }, 1000);
      }
    });
  }

}
