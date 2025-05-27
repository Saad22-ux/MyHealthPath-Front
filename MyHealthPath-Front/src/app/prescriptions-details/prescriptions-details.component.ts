// prescription-detail.component.ts
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionService } from '../services/prescription.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescriptions-details.component.html',
  imports: [RouterModule,NgFor,NgIf,CommonModule,FormsModule],
  styleUrls: ['./prescriptions-details.component.css']
})
export class PrescriptionsDetailsComponent implements OnInit {
  prescriptionId!: number;
  prescription: any;
  error: string = '';

  userRole: string = '';

  canSubmit: boolean = true;

  

  constructor(private route: ActivatedRoute, private prescriptionService: PrescriptionService, private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.prescriptionId = Number(this.route.snapshot.paramMap.get('id'));

    const lastSubmit = localStorage.getItem(`journalCooldown_${this.prescriptionId}`);
    if (lastSubmit) {
      const last = new Date(lastSubmit).getTime();
      const now = Date.now();
      this.canSubmit = (now - last) > 24 * 60 * 60 * 1000;
    }

    this.prescriptionService.getPrescriptionDetails(this.prescriptionId).subscribe({
      next: (res) => {
        this.prescription = res.prescription;
        this.checkIfPrescriptionExpired();
      },
      error: () => {
        this.error = 'Failed to load prescription details';
      }
    });
  }

  checkIfPrescriptionExpired(): void {
  const startDate = new Date(this.prescription.dateDebut); // Assure-toi que dateDebut existe dans ta prescription
  const today = new Date();

  const durationDays = Math.max(...this.prescription.medicaments.map((m: any) => m.duree || 0));
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + durationDays);

  if (today > endDate) {
    this.prescription.isActive = false;
    console.log("Prescription expired — isActive set to false.");
  }
}


  submitJournal() {
  const medicaments = this.prescription.medicaments.map((med: any) => ({
    medicamentId: med.id,
    pris: med.isChecked === true ? true : false
  }));
    console.log('Medicaments to submit:', medicaments);

  const indicateurs = (this.prescription.indicateurs || []).map((ind: any) => ({
    indicateurId: ind.id,
    valeur: ind.valeur || '',
    mesure: (ind.valeur && ind.valeur.trim() !== '') ? 1 : ''
  }));
  console.log('Indicateurs to submit:', indicateurs);

  const hasCheckedMedicament = medicaments.some((med: { pris: boolean }) => med.pris === true);
  const hasValidIndicateur = indicateurs.some((ind: any) => ind.valeur && ind.valeur.trim() !== '');
  if (!hasCheckedMedicament && !hasValidIndicateur) {
    alert('Veuillez cocher au moins un médicament ou renseigner au moins un indicateur.');
    return;
  }

  const patientId = this.authService.getPatientId();
  console.log('Patient ID:', patientId);
  if (!patientId) {
    alert('Patient ID is missing.');
    return;
  }

  const data = {
    date: new Date(),
    medicaments,
    indicateurs,
    prescriptionId: this.prescriptionId
  };

  this.prescriptionService.createJournal(patientId, data).subscribe({
    next: () => {
      alert('Journal de santé enregistré avec succès.');
      localStorage.setItem(`journalCooldown_${this.prescriptionId}`, new Date().toISOString());
      this.canSubmit = false;
    },
    error: (err) => {
      console.error('Journal save error:', err);
      alert('Erreur lors de l\'enregistrement du journal.');
    }
  });

}

}
