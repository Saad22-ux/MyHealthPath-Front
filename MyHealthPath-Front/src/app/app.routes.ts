import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UnapprovedMedecinsComponent } from './unapproved-medecins/unapproved-medecins.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { AddMedicationComponent } from './add-medication/add-medication.component';
import { AddPrescriptionComponent } from './add-prescription/add-prescription.component';
import { PrescriptionsDetailsComponent } from './prescriptions-details/prescriptions-details.component';
import { MyPrescriptionsComponent } from './my-prescriptions/my-prescriptions.component';
import { SuiviDashboard } from './suivi-dashboard/suivi-dashboard.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login page route
  { path: 'dashboard', component: DashboardComponent},  // <-- Protect the dashboard route
  { path: 'home', component: HomeComponent }, // Home route
  { path: 'about', component: AboutComponent }, // About route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent }, 
  { path: 'unapproved-medecins', component: UnapprovedMedecinsComponent },
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'patient-list', component: PatientListComponent },
  { path: 'patient/:id', component: PatientDetailComponent },
  { path: 'add-medication/:id', component: AddMedicationComponent },
  { path: 'add-prescription/:patientId', component: AddPrescriptionComponent },
  { path: 'add-prescription/:patientId/:prescriptionId', component: AddPrescriptionComponent },
  { path: 'prescriptions-details/:id', component: PrescriptionsDetailsComponent },
  { path: 'my-prescriptions', component: MyPrescriptionsComponent },
  { path: 'suivi-dashboard', component: SuiviDashboard },
  { path: 'patient-dashboard/:patientId/:prescriptionId/statistiques', component: PatientDashboardComponent }
];