import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrescriptionService } from '../services/prescription.service';
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
  console.log('patientId from URL:', patientId); // Add a log to check
  
  if (patientId) {
    this.patientId = +patientId;  // Convert to number
  } else {
    console.log('No patientId found in URL');
  }

  this.prescriptionService.getIndicateursBySpecialite().subscribe({
    next: (res) => {
      this.indicateurs.clear();
      res.indicateurs.forEach(ind => {
        this.indicateurs.push(this.fb.control(ind, Validators.required));
      });
    },
    error: (err) => {
      console.error('Failed to load indicators:', err);
    }
  });
}


  get medicaments(): FormArray {
    return this.prescriptionForm.get('medicaments') as FormArray;
  }

  get indicateurs(): FormArray {
    return this.prescriptionForm.get('indicateurs') as FormArray;
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
    this.indicateurs.push(this.fb.control('', Validators.required));
  }

  removeIndicateur(index: number) {
    this.indicateurs.removeAt(index);
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

    // Send the patientId with the request
    this.prescriptionService.addPrescription(this.patientId, payload).subscribe({
      next: (res: any) => {
        this.responseMessage = res.message;
        setTimeout(() => {
          this.responseMessage = '';
        }, 2000);
        this.prescriptionForm.reset();
        this.medicaments.clear();
        this.indicateurs.clear();
        this.addMedicament();
        this.addIndicateur();
      },
      error: (err) => {
        this.responseMessage = 'Erreur lors de l’envoi.';
      }
    });
  }
}
