import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.prescriptionId = Number(this.route.snapshot.paramMap.get('id'));

  this.prescriptionService.getPrescriptionDetails(this.prescriptionId).subscribe({
    next: (res: any) => {
      this.prescription = res.prescription;

      this.prescriptionService.getJournalByPrescription(this.prescriptionId).subscribe({
        next: (res: any) => {
          if (res.success) {
            const journaux = res.data.journaux;

            const today = new Date().toDateString();

            const journauxAujourdHui = journaux.filter((j: any) =>
              this.isSameDate(j.date, today)
            );

            const medicamentsPrisIds = new Set<number>();
            const indicateursMesuresIds = new Set<number>();

            journauxAujourdHui.forEach((journal: any) => {
              journal.SuiviMedicaments?.forEach((med: any) => {
                if (med.pris === true) medicamentsPrisIds.add(med.MedicamentId ?? med.medicamentId);
              });
              journal.SuiviIndicateurs?.forEach((ind: any) => {
                if (ind.mesure === 1 || ind.mesure === true) indicateursMesuresIds.add(ind.IndicateurId ?? ind.indicateurId);
              });
            });

            this.prescription.medicaments.forEach((med: any) => {
              med.isChecked = medicamentsPrisIds.has(med.id);
            });

            this.prescription.indicateurs.forEach((ind: any) => {
              if (indicateursMesuresIds.has(ind.id)) {
                ind.valeur = 'mesuré';
              } else {
                ind.valeur = '';
              }
            });

            this.filteredMedicaments = this.prescription.medicaments.filter(
              (med: any) => !med.isChecked
            );
            this.filteredIndicateurs = this.prescription.indicateurs.filter(
              (ind: any) => !(ind.valeur && ind.valeur.trim() !== '')
            );

          } else {
            this.error = res.message;
            this.filteredMedicaments = [...this.prescription.medicaments];
            this.filteredIndicateurs = [...this.prescription.indicateurs];
          }
        },
        error: () => {
          this.filteredMedicaments = [...this.prescription.medicaments];
          this.filteredIndicateurs = [...this.prescription.indicateurs];
        }
      });
    },
    error: () => {
      this.error = 'Erreur lors du chargement de la prescription';
    }
  });
}



  applyFilter(journalState: { medicamentsPris: number[]; indicateursMesures: number[] }) {
    const medicamentsPrisIds = new Set(journalState.medicamentsPris);
    const indicateursMesuresIds = new Set(journalState.indicateursMesures);

    // Garde uniquement les médicaments **non pris**
    this.filteredMedicaments = this.prescription.medicaments.filter(
      (med: any) => !medicamentsPrisIds.has(med.id)
    );

    // Garde uniquement les indicateurs **non mesurés**
    this.filteredIndicateurs = this.prescription.indicateurs?.filter(
      (ind: any) => !indicateursMesuresIds.has(ind.id)
    ) || [];
  }


submitJournal() {
  const medicaments = this.prescription.medicaments.map((med: any) => ({
    medicamentId: med.id,
    pris: !!med.isChecked,
  }));

  const indicateurs = (this.prescription.indicateurs || []).map((ind: any) => ({
    indicateurId: ind.id,
    valeur: ind.valeur || '',
    mesure: ind.valeur?.trim() ? 1 : null,
  }));

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

      // Recharge les journaux et applique filtre
      this.prescriptionService.getJournalByPrescription(this.prescriptionId).subscribe({
        next: (res: any) => {
          if (res.success) {
            const journaux = res.data.journaux;
            const today = new Date().toDateString();

            const journauxAujourdHui = journaux.filter((j: any) =>
              this.isSameDate(j.date, today)
            );

            const medicamentsPrisIds = new Set<number>();
            const indicateursMesuresIds = new Set<number>();

            journauxAujourdHui.forEach((journal: any) => {
              journal.SuiviMedicaments?.forEach((med: any) => {
                if (med.pris === true) medicamentsPrisIds.add(med.MedicamentId ?? med.medicamentId);
              });
              journal.SuiviIndicateurs?.forEach((ind: any) => {
                if (ind.mesure === 1 || ind.mesure === true) indicateursMesuresIds.add(ind.IndicateurId ?? ind.indicateurId);
              });
            });

            // Met à jour l'état complet
            this.prescription.medicaments.forEach((med: any) => {
              med.isChecked = medicamentsPrisIds.has(med.id);
            });
            this.prescription.indicateurs.forEach((ind: any) => {
              if (indicateursMesuresIds.has(ind.id)) {
                ind.valeur = ind.valeur || 'mesuré';
              } else {
                ind.valeur = '';
              }
            });

            // Applique filtre uniquement pour affichage
            this.filteredMedicaments = this.prescription.medicaments.filter(
              (med: any) => !med.isChecked
            );
            this.filteredIndicateurs = this.prescription.indicateurs.filter(
              (ind: any) => !(ind.valeur && ind.valeur.trim() !== '')
            );

            // Mets à jour localStorage si besoin...
            // Lors de la soumission réussie
            const journalState = {
              date: new Date().toISOString().split('T')[0], // ex. "2025-06-10"
              medicamentsPris: Array.from(medicamentsPrisIds),
              indicateursMesures: Array.from(indicateursMesuresIds),
            };
            localStorage.setItem(`journalState_${this.prescriptionId}`, JSON.stringify(journalState));
          } else {
            this.statusMessage = 'Erreur lors du rafraîchissement des journaux après soumission.';
          }
          setTimeout(() => {
          this.router.navigate(['/my-prescriptions']);
        }, 1500);
        },
        error: () => {
          this.statusMessage = 'Erreur lors du rafraîchissement des journaux après soumission.';
        }
      });
    },
    error: (err) => {
      this.error = err.error?.message || 'Erreur lors de la création du journal';
    }
  });
}

  isSameDate(date1: string, date2: string): boolean {
    return new Date(date1).toDateString() === new Date(date2).toDateString();
  }
}
