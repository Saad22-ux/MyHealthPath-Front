import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService} from '../../services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-patient',
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.css']
})
export class UpdatePatientComponent implements OnInit {
  patientId!: number;
  updateForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      return;
    }
    this.patientId = +idParam;
    this.initForm();
    this.loadPatientData();

    this.updateForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
      this.successMessage = '';
    });
  }

  initForm() {
    this.updateForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      genre: ['', Validators.required],
      cin: ['', Validators.required],
      telephone: ['', Validators.required],
      adress: ['', Validators.required],
      taille: ['', Validators.required],
      poids: ['', Validators.required],
      date_naissance: ['', Validators.required],
    });
  }

  loadPatientData() {
    this.loading = true;
    this.patientService.consultPatient(this.patientId).subscribe({
      next: (res) => {
        const data = res.data;
        this.updateForm.patchValue({
          fullName: data.User?.fullName || '',
          email: data.User?.email || '',
          genre: data.genre || '',
          cin: data.User?.cin || '',
          taille: data.taille || '',
          poids: data.poids || '',
          telephone: data.User?.telephone || '',
          adress: data.User?.adress || '',
          date_naissance: data.date_naissance ? data.date_naissance.split('T')[0] : '',
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to fetch patient';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.updateForm.disable();

    const updatedFields = this.updateForm.value;

    this.patientService.updatePatient(this.patientId, updatedFields).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Profile updated successfully';
        this.loading = false;
        this.updateForm.enable();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Failed to update profile";
        this.loading = false;
        this.updateForm.enable();
      },
    });
  }
}
