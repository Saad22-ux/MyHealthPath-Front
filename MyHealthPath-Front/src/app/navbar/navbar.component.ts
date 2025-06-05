import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';  // Import AuthService
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
      console.log('Updated user role:', role); // 🔍 For debugging
    });

  }


  logout(): void {
    this.authService.logout().subscribe(() => {
      this.isAuthenticated = false;
      this.authService.setRole('');  // ✅ Clear it from service
      this.router.navigate(['/login']);  // Redirect to login after logout
    });
  }
  
  isAdmin(): boolean {
    return this.userRole === 'admin';  // Check if the user is an admin
  }

  isMedecin(): boolean {
    return this.userRole === 'medecin';
  }

  isPatient(): boolean {
    return this.userRole === 'patient';
  }
}
