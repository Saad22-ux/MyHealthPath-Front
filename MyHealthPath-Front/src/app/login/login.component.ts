import { Component, OnInit, AfterViewInit  } from '@angular/core';
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
export class LoginComponent implements OnInit, AfterViewInit{
  email = '';
  password = '';

  validationError: string = '';
  emailInvalid: boolean = false; 
  passwordInvalid: boolean = false;

  telephone = '';
  adress = '';
  cin = '';
  numeroIdentification = '';
  fullName = '';
  specialite = '';
  submitted = false;

  statusMessage: string = '';
  isSuccess: boolean = true;
  validationErrors: {[key: string]: string[]} = {};

  showMessage: boolean = false;
  messageTimeout: any;

  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  displayMessage(message: string, isSuccess: boolean, duration: number = 3000) {
    this.statusMessage = message;
    this.isSuccess = isSuccess;
    this.showMessage = true;

    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }

    this.messageTimeout = setTimeout(() => {
      this.showMessage = false;
      this.statusMessage = '';
      this.validationError = '';
    }, duration);
  }


  ngAfterViewInit(): void {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });

      signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });
    }
  }


  public login(): void {
    this.emailInvalid = !this.email.trim();
    this.passwordInvalid = !this.password.trim();

    if (this.emailInvalid || this.passwordInvalid){
      this.displayMessage('Please fill in all required fields', false);
      return;
    }

    this.validationError = '';
    this.statusMessage = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.displayMessage(response.message || 'Login successful!', true);
        setTimeout(() => {
          this.statusMessage = '';
          if(this.auth.getUserRole() === 'admin'){
            this.router.navigateByUrl('dashboard-admin');
          }
          if(this.auth.getUserRole() === 'medecin'){
            this.router.navigateByUrl('dashboard-medecin');
          }
          if(this.auth.getUserRole() === 'patient'){
            this.router.navigateByUrl('dashboard-patient');
          }
        },1000);
      },
      error: err =>{
        this.displayMessage(err.error?.message || 'Login failed. Please try again.', false);
        setTimeout(()=>{
          this.validationError = '';
        },3000);
      }
    });
  }

  register() {
    this.submitted = true;
    this.statusMessage = '';
    this.validationErrors = {};
    if (!this.fullName || !this.specialite || !this.email || !this.password || !this.telephone || !this.adress || !this.numeroIdentification) {
      this.displayMessage('Please fill in all required fields', false);
      this.isSuccess = false;
      return;
    }
    this.validationErrors = {};
    this.statusMessage = '';
    this.isSuccess = true;
    this.auth.register(this.email, this.password, this.fullName, this.specialite, this.telephone, this.adress, this.cin, this.numeroIdentification).subscribe({
      next: (response: any) => {
        this.displayMessage(response.message || 'Registration successful!', true);
        this.isSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/home']);
        },2000);
      },
      error: (err) => {
        if (err.error && err.error.errors) {
          this.validationErrors = err.error.errors || {};
        } else {
          this.displayMessage(err.error?.message || 'Registration failed. Please try again.', false);
          this.isSuccess = false;
        }
      }
    });
  }
}
