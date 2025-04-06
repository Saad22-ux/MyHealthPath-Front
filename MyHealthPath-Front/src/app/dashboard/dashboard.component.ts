import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';  // Import your AuthService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls : ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if the user is authenticated when the dashboard loads
    if (!this.authService.isAuthenticated()) {
      // Redirect to login if the user is not authenticated
      this.router.navigate(['/login']);
    }
  }
}
