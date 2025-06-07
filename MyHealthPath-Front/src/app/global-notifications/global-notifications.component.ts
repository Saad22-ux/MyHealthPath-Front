import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../services/notification.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-global-notifications',
  templateUrl: './global-notifications.component.html',
  imports: [NgIf,NgFor,CommonModule],
  styleUrls: ['./global-notifications.component.css']
})
export class GlobalNotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.notificationService.loadNotifications();

    setInterval(() => {
      this.notificationService.loadNotifications();
    }, 300000);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.notificationService.loadNotifications();
    }); 

    this.notificationService.notifications$.subscribe((data) => {
      this.notifications = data.filter(n => !n.isRead);
    });

    this.authService.logout$.subscribe(() => {
      this.notifications = [];
    });
  }

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.isRead = true;
      this.notifications = this.notifications.filter(n => !n.isRead);
    });
  }
}
