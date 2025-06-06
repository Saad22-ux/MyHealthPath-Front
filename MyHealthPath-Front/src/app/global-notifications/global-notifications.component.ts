import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../services/notification.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-global-notifications',
  templateUrl: './global-notifications.component.html',
  imports: [NgIf,NgFor,CommonModule],
  styleUrls: ['./global-notifications.component.css']
})
export class GlobalNotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    // Charger une première fois
    this.notificationService.loadNotifications();

    // Recharger toutes les 5 minutes
    setInterval(() => {
      this.notificationService.loadNotifications();
    }, 300000);

    // Mettre à jour les notifications à chaque navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.notificationService.loadNotifications();
    }); 

    // S'abonner aux notifications
    this.notificationService.notifications$.subscribe((data) => {
      this.notifications = data.filter(n => !n.isRead);
    });
  }

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.isRead = true;
      this.notifications = this.notifications.filter(n => !n.isRead);
    });
  }
}
