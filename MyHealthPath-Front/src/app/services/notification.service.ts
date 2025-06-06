import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject  } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`http://localhost:3000/notifications`, { withCredentials: true });
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`http://localhost:3000/notifications/${notificationId}/lue`, {}, { withCredentials: true });
  }
  

  loadNotifications(): void {
    this.getNotifications().subscribe({
      next: (data) => {
        this.notificationsSubject.next(data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications', err);
      }
    });
  }
}
