import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Add Validators
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-medication',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './add-medication.component.html',
  styleUrls: ['./add-medication.component.css']
})
export class AddMedicationComponent implements OnInit {
  medicationForm: FormGroup;
  patientId!: number;

  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    // Added required validation
    this.medicationForm = this.fb.group({
      name: ['', Validators.required],  // Required validation
      dose: ['', Validators.required],  // Required validation
      frequency: ['', Validators.required]  // Required validation
    });
  }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
  }

  submit(): void {
    if (this.medicationForm.valid) {
      this.patientService.addMedicament(this.patientId, this.medicationForm.value).subscribe({
        next: () => {
          this.success = 'Medication added!';
          setTimeout(() => this.router.navigate([`/prescription`, this.patientId]), 1000);
        },
        error: () => this.error = 'Failed to add medication'
      });
    }
  }
}