import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls : ['./login.component.css']
})
export class LoginComponent {
  @Input() email = '';
  @Input() password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('dashboard'), // Redirect to dashboard after successful login
      error: err =>{
        this.router.navigateByUrl(''),
        this.email = '',
        this.password = ''
      }// Handle login failure
    });
  }
}
