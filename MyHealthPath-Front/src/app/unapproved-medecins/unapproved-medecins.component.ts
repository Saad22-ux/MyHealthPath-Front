import { Component, OnInit } from '@angular/core';
import { MedecinService } from '../services/medecin.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-unapproved-medecins',
  templateUrl: './unapproved-medecins.component.html',
  styleUrls: ['./unapproved-medecins.component.css'],
  imports: [NgFor,NgIf,FormsModule,CommonModule]
})
export class UnapprovedMedecinsComponent implements OnInit {
  medecins: any[] = [];
  visibleMedecins: any[] = [];
  itemsPerPage = 3;
  searchTerm = '';
  selectedSpecialty = '';
  specialties: string[] = [];
  sortColumn = 'createdAt';
  sortDirection = 'desc';
  statusMessage = '';
  isSuccess = true;

  constructor(private medecinService: MedecinService) {}

  ngOnInit(): void {
    this.loadMedecins();
  }

  loadMedecins() {
    this.medecinService.getUnapprovedMedecins().subscribe({
      next: (data) => {
        this.medecins = data;
        this.visibleMedecins = this.medecins.slice(0, this.itemsPerPage);
        this.extractSpecialties();
        this.statusMessage = '';
        this.isSuccess = true;
      },
      error: (err) => {
        this.statusMessage = err.error?.message || 'Failed to load pending doctors.';
        this.isSuccess = false;
      }
    });
  }

  approve(userId: number) {
    this.medecinService.approveMedecin(userId).subscribe({
      next: (response: any) => {
        this.statusMessage = response.message;
        this.isSuccess = true;
        this.ngOnInit();
      },
      error: (err) => {
        this.statusMessage = err.error?.message || 'Failed to approve médecin.';
        this.isSuccess = false;
      }
    });
  }

  extractSpecialties() {
    this.specialties = [...new Set(this.medecins.map(m => m.specialite))];
  }

  filterMedecins() {
    let filtered = this.medecins.filter(med => {
      const matchesSearch = med.User?.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          med.specialite.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSpecialty = this.selectedSpecialty ? med.specialite === this.selectedSpecialty : true;
      return matchesSearch && matchesSpecialty;
    });
    
    this.sortMedecins(filtered);
    this.visibleMedecins = filtered.slice(0, this.itemsPerPage);
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filterMedecins();
  }

  sortMedecins(array: any[]) {
    array.sort((a, b) => {
      let valA = this.sortColumn === 'createdAt' ? new Date(a[this.sortColumn]) : 
                this.sortColumn === 'fullName' ? a.User?.fullName : 
                a[this.sortColumn];
      let valB = this.sortColumn === 'createdAt' ? new Date(b[this.sortColumn]) : 
                this.sortColumn === 'fullName' ? b.User?.fullName : 
                b[this.sortColumn];
      
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  loadMore() {
    const startIndex = this.visibleMedecins.length;
    const endIndex = startIndex + this.itemsPerPage;
    const newMedecins = this.medecins.slice(startIndex, endIndex);
    this.visibleMedecins = [...this.visibleMedecins, ...newMedecins];
  }

  hasMoreMedecins(): boolean {
  return this.medecins.length > 0 && this.visibleMedecins.length < this.medecins.length;
}

  remainingMedecinsCount(): number {
    return this.medecins.length - this.visibleMedecins.length;
  }

}
