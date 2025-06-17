import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { AuthService } from '../../auth.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-journal',
  standalone: true,
  templateUrl: './create-journal.component.html',
  imports: [ NgFor, NgIf, CommonModule, FormsModule],
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
              const today = new Date().toISOString().split('T')[0]; // ex: "2025-06-11"

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

    this.filteredMedicaments = this.prescription.medicaments.filter(
      (med: any) => !medicamentsPrisIds.has(med.id)
    );

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

    const dateToday = new Date().toISOString().split('T')[0]; // "2025-06-11"
    const data = {
      date: dateToday,
      medicaments,
      indicateurs,
      prescriptionId: this.prescriptionId,
    };

    this.prescriptionService.createJournal(patientId, data).subscribe({
      next: (res: any) => {
        this.statusMessage = res.message || 'Journal créé avec succès';

        this.prescriptionService.getJournalByPrescription(this.prescriptionId).subscribe({
          next: (res: any) => {
            if (res.success) {
              const journaux = res.data.journaux;
              const today = new Date().toISOString().split('T')[0];

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
                  ind.valeur = ind.valeur || 'mesuré';
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

              const journalState = {
                date: today,
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
    // Comparaison directe de "2025-06-11" === "2025-06-11"
    return date1 === date2;
  }
}
