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
  successMessage: string = '';   // For success messages
  validationError: string = ''; // One field to control both input errors

  constructor(private auth: AuthService, private router: Router) {}

  login() {
      this.auth.login(this.email, this.password).subscribe({
      next: (response: any) => {
        // Display success message from backend
        this.successMessage = response.message;  // message sent from backend
        setTimeout(() => {
          this.successMessage = ''; // Clear success message
          this.router.navigateByUrl('dashboard');
        }, 1000);
      },
      error: err =>{
        console.error('Login error:', err);
        // Get the message sent from backend
        this.validationError = err.error?.message
        setTimeout(()=>{
          this.validationError = ''; // Clear error message
        },1000);
        
      }// Handle login failure
    });
  }

  // This method will navigate to the register page
  navigateToRegister() {
    this.router.navigate(['/register']); // Programmatically navigate to the Register page
  }
}
