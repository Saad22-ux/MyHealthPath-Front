import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrescriptionService } from '../../services/prescription.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [NgFor,ReactiveFormsModule,FormsModule],
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.css']
})
export class AddPrescriptionComponent implements OnInit {
  prescriptionForm: FormGroup;
  responseMessage: string = '';
  error = '';
  patientId: number = 0;
  editingPrescriptionId?: number;

  allIndicateurs: string[] = [];

  selectedIndicateur: string = '';

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.prescriptionForm = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required],
      medicaments: this.fb.array([]),
      indicateurs: this.fb.array([]),
      selectedIndicateur: [''],
    });

    this.addMedicament();
    this.addIndicateur();
  }

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('patientId');
    const prescriptionId = this.route.snapshot.paramMap.get('prescriptionId');

    if (patientId) {
      this.patientId = +patientId;
    }

    if (prescriptionId) {
      this.loadPrescriptionDetails(+prescriptionId);
    }

    this.prescriptionService.getIndicateursBySpecialite().subscribe({
      next: (res: any) => {
        this.allIndicateurs = res.indicateurs;
      },
      error: (err) => {
        this.error = err.error?.message || 'Cannot fetch indicators';
      }
    });
  }

  loadPrescriptionDetails(prescriptionId: number) {
    this.prescriptionService.getPrescriptionDetails(prescriptionId).subscribe({
      next: (data) => {
        const prescription = data.prescription;

        this.prescriptionForm.patchValue({
          description: prescription.description,
          date: prescription.date
        });

        this.medicaments.clear();
        (prescription.medicaments || []).forEach((med: any) => {
          this.medicaments.push(this.fb.group({
            name: [med.name, Validators.required],
            dose: [med.dose, Validators.required],
            frequency: [med.frequency, Validators.required],
            duree: [med.duree, Validators.required]
          }));
        });

        if (prescription.indicateurs) {
          this.indicateurs.clear();
          prescription.indicateurs.forEach((ind: any) => {
            this.indicateurs.push(this.fb.control(ind.nom, Validators.required));
          });
        }
        this.editingPrescriptionId = prescriptionId;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load prescription';
        }
      });
  }

  addMedicament() {
    this.medicaments.push(this.fb.group({
      name: ['', Validators.required],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      duree: ['', Validators.required]
    }));
  }

  removeMedicament(index: number) {
    this.medicaments.removeAt(index);
  }

  addIndicateur() {
    const selectedIndicateur = this.prescriptionForm.get('selectedIndicateur')?.value;

    if (!selectedIndicateur) {
      return;
    }

    if (this.currentIndicateurs.includes(selectedIndicateur)) {
      return;
    }

    this.indicateurs.push(this.fb.control(selectedIndicateur, Validators.required));

    this.prescriptionForm.get('selectedIndicateur')?.setValue('');
  }

  addSelectedIndicateur() {
    if (this.selectedIndicateur && !this.currentIndicateurs.includes(this.selectedIndicateur)) {
      this.indicateurs.push(this.fb.control(this.selectedIndicateur, Validators.required));
      this.selectedIndicateur = '';
    }
  }

  refreshIndicateursFormControls(indicators: string[]) {
    this.indicateurs.clear();
    indicators.forEach(ind => {
      this.indicateurs.push(this.fb.control(ind, Validators.required));
    });
  }

  removeIndicateur(index: number) {
    this.indicateurs.removeAt(index);
  }

  get indicateurs(): FormArray {
    return this.prescriptionForm.get('indicateurs') as FormArray;
  }

  get currentIndicateurs(): string[] {
    return this.indicateurs.controls.map(control => control.value);
  }

  get medicaments(): FormArray {
    return this.prescriptionForm.get('medicaments') as FormArray;
  }

  onSubmit() {
    if (this.prescriptionForm.invalid) return;

    const formValue = this.prescriptionForm.value;
    const payload = {
      description: formValue.description,
      date: formValue.date,
      medicaments: formValue.medicaments,
      indicateurs: formValue.indicateurs
    };

    if (this.editingPrescriptionId) {
      this.prescriptionService.updatePrescription(this.editingPrescriptionId, payload).subscribe({
        next: (res: any) => {
          this.responseMessage = res.message || 'Prescription updated';
          setTimeout(() => this.responseMessage = '',2000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update prescription';
        }
      });
    } else {
      this.prescriptionService.addPrescription(this.patientId, payload).subscribe({
        next: (res: any) => {
          this.responseMessage = res.message || 'Prescription created';
          setTimeout(() => {
            this.responseMessage = '';
            this.router.navigate(['/patient/',this.patientId]);
          },1000);
          this.prescriptionForm.reset();
          this.medicaments.clear();
          this.indicateurs.clear();
          this.addMedicament();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to add prescription';
        }
      });
    }
  }
}
