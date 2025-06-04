import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`http://localhost:3000/notifications`, { withCredentials: true });
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`http://localhost:3000/notifications/${notificationId}/lue`, {}, { withCredentials: true });
  }
}
