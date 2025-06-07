import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [NgIf,NgFor,CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;
  error: string | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();

    setInterval(() => {
      this.loadNotifications();
    }, 300000);
  }

loadNotifications() {
  this.loading = true;

  this.notificationService.getNotifications().subscribe({
    next: (data) => {
      const now = new Date().getTime();

      this.notifications = data.filter(n => {
        const createdAt = new Date(n.createdAt).getTime();
        return (now - createdAt) <= 24 * 60 * 60 * 1000; // 24 heures en ms
      });

      this.loading = false;
    },
    error: (err) => {
      this.error = 'Erreur lors du chargement des notifications';
      this.loading = false;
      console.error(err);
    }
  });
}


  markRead(notification: Notification) {
    if (notification.isRead) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
      },
      error: () => {
        alert('Impossible de marquer la notification comme lue.');
      }
    });
  }
}
