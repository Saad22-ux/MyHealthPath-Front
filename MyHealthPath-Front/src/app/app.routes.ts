import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './Medecin/register/register.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UnapprovedMedecinsComponent } from './unapproved-medecins/unapproved-medecins.component';
import { AddPatientComponent } from './Medecin/add-patient/add-patient.component';
import { PatientListComponent } from './Medecin/patient-list/patient-list.component';
import { PatientDetailComponent } from './Medecin/patient-detail/patient-detail.component';
import { AddPrescriptionComponent } from './Medecin/add-prescription/add-prescription.component';
import { PrescriptionsDetailsComponent } from './prescriptions-details/prescriptions-details.component';
import { MyPrescriptionsComponent } from './Patient/my-prescriptions/my-prescriptions.component';
import { SuiviDashboard } from './suivi-dashboard/suivi-dashboard.component';
import { PatientDashboardComponent } from './Patient/patient-dashboard/patient-dashboard.component';
import { UpdatePatientComponent } from './Medecin/update-patient/update-patient.component';
import { ProfilMedecinComponent } from './Medecin/profil-medecin/profil-medecin.component';
import { ProfilPatientComponent } from './Patient/profil-patient/profil-patient.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent }, 
  { path: 'unapproved-medecins', component: UnapprovedMedecinsComponent },
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'patient-list', component: PatientListComponent },
  { path: 'patient/:id', component: PatientDetailComponent },
  { path: 'add-prescription/:patientId', component: AddPrescriptionComponent },
  { path: 'add-prescription/:patientId/:prescriptionId', component: AddPrescriptionComponent },
  { path: 'prescriptions-details/:id', component: PrescriptionsDetailsComponent },
  { path: 'my-prescriptions', component: MyPrescriptionsComponent },
  { path: 'suivi-dashboard', component: SuiviDashboard },
  { path: 'patient-dashboard/:patientId/:prescriptionId/statistiques', component: PatientDashboardComponent },
  { path: 'patient/:id/update', component: UpdatePatientComponent },
  { path: 'profileMedecin', component: ProfilMedecinComponent },
  { path: 'profilePatient', component: ProfilPatientComponent }
];