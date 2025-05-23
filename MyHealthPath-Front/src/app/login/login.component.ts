import { Component, Input, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls : ['./login.component.css']
  
})
export class LoginComponent implements OnInit{
  @Input() email = '';
  @Input() password = '';
  successMessage: string = '';   // For success messages
  validationError: string = ''; // One field to control both input errors

  emailInvalid: boolean = false; // Flag for email validation
  passwordInvalid: boolean = false; // Flag for password validation

  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']); // Redirect if already logged in
    }
  }

  login() {
      // Reset validation flags
      this.emailInvalid = !this.email;
      this.passwordInvalid = !this.password;

      // If any field is empty, prevent form submission
      if (this.emailInvalid || this.passwordInvalid) {
        return;
      }

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
