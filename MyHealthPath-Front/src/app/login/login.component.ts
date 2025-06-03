import { Component, OnInit } from '@angular/core';
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
  email = '';
  password = '';
  successMessage: string = '';
  validationError: string = '';

  emailInvalid: boolean = false; 
  passwordInvalid: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.emailInvalid = !this.email.trim();
    this.passwordInvalid = !this.password.trim();

    if (this.emailInvalid || this.passwordInvalid){
      return;
    }

    this.validationError = '';
    this.successMessage = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.successMessage = response.message || 'Login successful!';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigateByUrl('dashboard');
        },3000);
      },
      error: err =>{
        this.validationError = err.error?.message || 'Login failed. Please try again.';
        setTimeout(()=>{
          this.validationError = '';
        },3000);
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
