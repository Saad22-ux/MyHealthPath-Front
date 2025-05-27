import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ensure AuthService is imported

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent {
  @Input() email = '';
  @Input() telephone = '';
  @Input() adress = '';
  @Input() numeroIdentification = '';
  @Input() password = '';
  @Input() fullName = '';
  @Input() specialite = '';
  submitted = false;

  statusMessage: string = '';
  isSuccess: boolean = true; // to control success vs error styling
  validationErrors: any = {}; // Object to store errors for each field

  constructor(private authService: AuthService, private router: Router) {}
  register() {
    this.authService.register(this.email, this.password, this.fullName, this.specialite, this.telephone, this.adress, this.numeroIdentification).subscribe({
      next: () => {
        this.statusMessage = 'Registration successful! Wait for admin to approve!';
        this.isSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000); // Redirect to login after successful registration
      },
      error: (err) => {
        // Check if the error response contains validation errors
        if (err.error && err.error.errors) {
          this.validationErrors = err.error.errors; // Set validation errors from the backend
        } else {
          this.statusMessage = 'Registration failed. Please try again.';
          this.isSuccess = false;
        }
      }
    });

    this.submitted = true;
    if (!this.fullName || !this.specialite || !this.email || !this.password || !this.telephone || !this.adress || !this.numeroIdentification) {
      return;
    }
  }
  
}
