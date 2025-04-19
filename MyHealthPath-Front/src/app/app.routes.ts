import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UnapprovedMedecinsComponent } from './pages/unapproved-medecins/unapproved-medecins.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login page route
  { path: 'dashboard', component: DashboardComponent},  // <-- Protect the dashboard route
  { path: 'home', component: HomeComponent }, // Home route
  { path: 'about', component: AboutComponent }, // About route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent }, 
  { path: 'unapproved-medecins', component: UnapprovedMedecinsComponent },
];