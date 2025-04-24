import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UnapprovedMedecinsComponent } from './pages/unapproved-medecins/unapproved-medecins.component';
import { AddPatientComponent } from './pages/add-patient/add-patient.component';
import { PatientComponent } from './pages/patient/patient.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { AddMedicationComponent } from './add-medication/add-medication.component';
import { PrescriptionComponent } from './prescription/prescription.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login page route
  { path: 'dashboard', component: DashboardComponent},  // <-- Protect the dashboard route
  { path: 'home', component: HomeComponent }, // Home route
  { path: 'about', component: AboutComponent }, // About route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent }, 
  { path: 'unapproved-medecins', component: UnapprovedMedecinsComponent },
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'patient/:id', component: PatientDetailComponent },
  { path: 'add-medication/:id', component: AddMedicationComponent },
  { path: 'prescription/:id', component: PrescriptionComponent },
];