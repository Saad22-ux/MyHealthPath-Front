import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.patientId = +idParam; // or Number(idParam)
    }  
    this.initForm();
    this.loadPatientData();
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
      next: (data) => {
        console.log('Backend patient data:', data);
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
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des données du patient.';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    console.log('Submit clicked');
    if (this.updateForm.invalid) {
      console.log('Form invalid', this.updateForm.errors);
      return;}

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedFields = this.updateForm.value;

    this.patientService.updatePatient(this.patientId, updatedFields).subscribe({
      next: (res) => {
        console.log('Update response:', res);
        this.successMessage = 'Profil mis à jour avec succès!';
        this.loading = false;
        // Optionally, navigate away after success
        // this.router.navigate(['/patients', this.patientId]);
      },
      error: (err) => {
        console.error('Update error:', err);
        this.errorMessage = "Erreur lors de la mise à jour du profil.";
        this.loading = false;
      },
    });
  }
}
