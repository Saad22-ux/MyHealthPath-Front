import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';  // Import AuthService
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-navbar',
  imports: [NgIf,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });

  }


  logout(): void {
    this.authService.logout().subscribe(() => {
      this.isAuthenticated = false;
      this.router.navigate(['/login']);  // Redirect to login after logout
    });
  }
}
