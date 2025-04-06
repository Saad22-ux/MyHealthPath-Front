import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login page route
  { path: 'dashboard', component: DashboardComponent},  // <-- Protect the dashboard route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];