import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-list-users',
  imports: [NgIf,NgFor],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: any[] = [];
  errorMessage = '';
  statusMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.errorMessage = '';
    this.statusMessage = '';

    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load users';
      }
    });
  }

  toggleStatus(user: any): void {
    this.errorMessage = '';
    this.statusMessage = '';

    this.authService.toggleUserStatus(user.id).subscribe({
      next: (res: any) => {
        user.isApproved = !user.isApproved;
        this.statusMessage = res.message || 'Status updated successfully';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update state';
      }
    });
  }
}
