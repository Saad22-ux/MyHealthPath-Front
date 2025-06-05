import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-journal',
  standalone: true,
  templateUrl: './create-journal.component.html',
  imports: [RouterModule, NgFor, NgIf, CommonModule, FormsModule],
  styleUrls: ['./create-journal.component.css']
})
export class CreateJournalComponent implements OnInit {
  prescriptionId!: number;
  prescription: any;

  filteredMedicaments: any[] = [];
  filteredIndicateurs: any[] = [];

  error: string = '';
  statusMessage = '';

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private authService: AuthService
  ) {}

ngOnInit(): void {
  this.prescriptionId = Number(this.route.snapshot.paramMap.get('id'));

  this.prescriptionService.getPrescriptionDetails(this.prescriptionId).subscribe({
    next: (res: any) => {
      this.prescription = res.prescription;
      console.log('Prescription chargée :', this.prescription);
      console.log('Journaux:', this.prescription.journaux); // undefined

      // Comme on n'a pas de journaux, on affiche tout directement (pas de filtre)
      this.filteredMedicaments = [...this.prescription.medicaments];
      this.filteredIndicateurs = this.prescription.indicateurs ? [...this.prescription.indicateurs] : [];
    },
    error: (err) => {
      this.error = err.error?.message || 'Erreur chargement prescription';
    }
  });
}

  applyFilter(journalState: { medicamentsPris: number[]; indicateursMesures: number[] }) {
    console.log('Appliquer filtre avec journalState:', journalState);

    // Assure-toi que IDs sont des numbers
    const medicamentsPrisIds = journalState.medicamentsPris.map((id: any) => Number(id));
    const indicateursMesuresIds = journalState.indicateursMesures.map((id: any) => Number(id));

    this.filteredMedicaments = this.prescription.medicaments.filter(
      (med: any) => !medicamentsPrisIds.includes(Number(med.id))
    );
    this.filteredIndicateurs = this.prescription.indicateurs
      ? this.prescription.indicateurs.filter((ind: any) => !indicateursMesuresIds.includes(Number(ind.id)))
      : [];

    console.log('Medicaments filtrés:', this.filteredMedicaments);
    console.log('Indicateurs filtrés:', this.filteredIndicateurs);
  }

  submitJournal() {
    // On récupère les meds cochés (pris) et indicateurs avec valeurs (mesurés)
    const medicaments = this.filteredMedicaments.map((med: any) => ({
      medicamentId: med.id,
      pris: !!med.isChecked,
    }));

    const indicateurs = (this.filteredIndicateurs || []).map((ind: any) => ({
      indicateurId: ind.id,
      valeur: ind.valeur || '',
      mesure: ind.valeur?.trim() ? 1 : null,
    }));

    // Validation simple : au moins un médicament pris ou un indicateur mesuré
    const hasCheckedMedicament = medicaments.some((med: any) => med.pris === true);
    const hasValidIndicateur = indicateurs.some((ind: any) => ind.valeur && ind.valeur.trim() !== '');
    if (!hasCheckedMedicament && !hasValidIndicateur) {
      this.statusMessage = 'Aucune valeur saisie ou médicament coché.';
      return;
    }

    this.statusMessage = '';

    const patientId = this.authService.getPatientId();
    if (!patientId) {
      this.error = 'Patient ID non trouvé';
      return;
    }

    const data = {
      date: new Date(),
      medicaments,
      indicateurs,
      prescriptionId: this.prescriptionId,
    };

    this.prescriptionService.createJournal(patientId, data).subscribe({
      next: (res: any) => {
        this.statusMessage = res.message || 'Journal créé avec succès';

        // Met à jour journalState dans localStorage pour exclure pris/mesurés
        const localKey = `journalState_${this.prescriptionId}`;
        let savedState = localStorage.getItem(localKey);
        let journalState = savedState
          ? JSON.parse(savedState)
          : { medicamentsPris: [], indicateursMesures: [] };

        medicaments.forEach((med: any) => {
          if (med.pris && !journalState.medicamentsPris.includes(med.medicamentId)) {
            journalState.medicamentsPris.push(med.medicamentId);
          }
        });

        indicateurs.forEach((ind: any) => {
          if (ind.mesure === 1 && !journalState.indicateursMesures.includes(ind.indicateurId)) {
            journalState.indicateursMesures.push(ind.indicateurId);
          }
        });

        localStorage.setItem(localKey, JSON.stringify(journalState));
        this.applyFilter(journalState);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création du journal';
      },
    });
  }
}
