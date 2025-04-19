import { Component, OnInit } from '@angular/core';
import { MedecinService } from '../../services/medecin.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-unapproved-medecins',
  templateUrl: './unapproved-medecins.component.html',
  styleUrls: ['./unapproved-medecins.component.css'],
  imports: [NgFor]
})
export class UnapprovedMedecinsComponent implements OnInit {
  medecins: any[] = [];

  constructor(private medecinService: MedecinService) {}

  ngOnInit(): void {
    this.medecinService.getUnapprovedMedecins().subscribe({
      next: (data) => this.medecins = data,
      error: (err) => console.error('Error fetching medecins:', err)
    });
  }


  approve(userId: number) {
    console.log('Clicked Approve for user:', userId); // 👈 Add this line
    this.medecinService.approveMedecin(userId).subscribe({
      next: (res) => {
        console.log('Approved:', res);
        // Refresh list
        this.ngOnInit();
      },
      error: (err) => console.error('Approve error:', err)
    });
  }


  
}
