import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule, NgIf } from '@angular/common';



@Component({
  selector: 'app-navbar',
  imports: [NgIf,RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userRole: string = '';
  patientId: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
  
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
      console.log('Updated user role:', role);
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.isAuthenticated = false;
      this.authService.setRole('');
      this.router.navigate(['/login']);
    });
  }
  
  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  isMedecin(): boolean {
    return this.userRole === 'medecin';
  }

  isPatient(): boolean {
    return this.userRole === 'patient';
  }
}
