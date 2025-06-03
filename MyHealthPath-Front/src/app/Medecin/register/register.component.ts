import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent {
  email = '';
  telephone = '';
  adress = '';
  cin = '';
  numeroIdentification = '';
  password = '';
  fullName = '';
  specialite = '';
  submitted = false;

  statusMessage: string = '';
  isSuccess: boolean = true;
  validationErrors: any = {};

  constructor(private authService: AuthService, private router: Router) {}
  register() {
    this.submitted = true;
    if (!this.fullName || !this.specialite || !this.email || !this.password || !this.telephone || !this.adress || !this.numeroIdentification) {
      this.statusMessage = 'Please fill in all required fields.';
      this.isSuccess = false;
      return;
    }
    this.validationErrors = {};
    this.statusMessage = '';
    this.isSuccess = true;
    this.authService.register(this.email, this.password, this.fullName, this.specialite, this.telephone, this.adress, this.cin, this.numeroIdentification).subscribe({
      next: (response: any) => {
        this.statusMessage = response.message || 'Registration successful!';
        this.isSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        },2000);
      },
      error: (err) => {
        if (err.error && err.error.errors) {
          this.validationErrors = err.error.errors;
        } else {
          this.statusMessage = err.error?.message || 'Registration failed. Please try again.';
          this.isSuccess = false;
        }
      }
    });
  }
}
