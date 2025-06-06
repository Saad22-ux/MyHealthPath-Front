import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { GlobalNotificationsComponent } from './global-notifications/global-notifications.component';
import { NotificationService } from './services/notification.service';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [NgIf,RouterOutlet,NavbarComponent,GlobalNotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  role: string = '';
  title = 'MyHealthPath-Front';
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRole(); // Exemple: retourne 'patient' ou 'admin'

    if (this.role === 'patient') {
      this.notificationService.loadNotifications();

      // Rafraîchir toutes les 5 min
      setInterval(() => {
        this.notificationService.loadNotifications();
      }, 300000);
    }
  }
}
