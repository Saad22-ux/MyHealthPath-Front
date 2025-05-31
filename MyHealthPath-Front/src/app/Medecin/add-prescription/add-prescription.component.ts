import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrescriptionService } from '../../services/prescription.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-add-prescription',
  imports: [NgFor,ReactiveFormsModule],
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.css']
})
export class AddPrescriptionComponent implements OnInit {
  prescriptionForm: FormGroup;
  responseMessage: string = '';
  patientId: number = 0;
  editingPrescriptionId?: number;

  allIndicateurs: string[] = [];



  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private route: ActivatedRoute  // Inject ActivatedRoute
  ) {
    this.prescriptionForm = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required],
      medicaments: this.fb.array([]),
      indicateurs: this.fb.array([])
    });

    this.addMedicament();
    this.addIndicateur();
  }

  ngOnInit(): void {
  // Log the entire paramMap to check if it contains patientId
  const patientId = this.route.snapshot.paramMap.get('patientId');
  const prescriptionId = this.route.snapshot.paramMap.get('prescriptionId');
  console.log('patientId from URL:', patientId); // Add a log to check
  
  if (patientId) {
    this.patientId = +patientId;  // Convert to number
  } else {
    console.log('No patientId found in URL');
  }

   if (prescriptionId) {
    this.loadPrescriptionDetails(+prescriptionId); // Load existing data
  }

  this.prescriptionService.getIndicateursBySpecialite().subscribe({
    next: (res) => {
      this.allIndicateurs = res.indicateurs;
      this.refreshIndicateursFormControls(this.allIndicateurs);
    },
    error: (err) => {
      console.error('Failed to load indicators:', err);
    }
  });
}

refreshIndicateursFormControls(indicators: string[]) {
  this.indicateurs.clear();
  indicators.forEach(ind => {
    this.indicateurs.push(this.fb.control(ind, Validators.required));
  });
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



  addMedicament() {
    this.medicaments.push(this.fb.group({
      name: ['', Validators.required],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      duree: ['', Validators.required]
    }));
  }

  removeMedicament(index: number) {
    this.indicateurs.removeAt(index);
  }

  addIndicateur() {
  // Find which indicators are missing (deleted)
  const missing = this.allIndicateurs.filter(ind => !this.currentIndicateurs.includes(ind));

  if (missing.length > 0) {
    // Add the first missing indicator back
    this.indicateurs.push(this.fb.control(missing[0], Validators.required));
    console.log('Restored indicator:', missing[0]);
  } else {
    console.log('No deleted indicators to restore.');
  }
  }

  removeIndicateur(index: number) {
    this.indicateurs.removeAt(index);
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
          this.indicateurs.push(this.fb.control(ind.name, Validators.required));
        });
      }

      this.editingPrescriptionId = prescriptionId;
    },
    error: (err) => {
      console.error('Failed to load prescription:', err);
    }
  });
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
    // UPDATE
    this.prescriptionService.updatePrescription(this.editingPrescriptionId, payload).subscribe({
      next: (res: any) => {
        this.responseMessage = res.message;
        setTimeout(() => (this.responseMessage = ''), 2000);
      },
      error: () => {
        this.responseMessage = 'Erreur lors de la mise à jour.';
      }
    });
  } else {
    // ADD
    this.prescriptionService.addPrescription(this.patientId, payload).subscribe({
      next: (res: any) => {
        this.responseMessage = res.message;
        setTimeout(() => (this.responseMessage = ''), 2000);
        this.prescriptionForm.reset();
        this.medicaments.clear();
        this.indicateurs.clear();
        this.addMedicament();
        this.addIndicateur();
      },
      error: () => {
        this.responseMessage = 'Erreur lors de l’envoi.';
      }
    });
  }
  }

  


}
