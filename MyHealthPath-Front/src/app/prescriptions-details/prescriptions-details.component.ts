// prescription-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionService } from '../services/prescription.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescriptions-details.component.html',
  imports: [RouterModule,NgFor,NgIf,CommonModule],
  styleUrls: ['./prescriptions-details.component.css']
})
export class PrescriptionsDetailsComponent implements OnInit {
  prescriptionId!: number;
  prescription: any;
  error: string = '';

  constructor(private route: ActivatedRoute, private prescriptionService: PrescriptionService) {}

  ngOnInit(): void {
    this.prescriptionId = Number(this.route.snapshot.paramMap.get('id'));

    this.prescriptionService.getPrescriptionDetails(this.prescriptionId).subscribe({
      next: (res) => {
        console.log('Prescription response:', res);
        this.prescription = res.prescription;
      },
      error: () => {
        this.error = 'Failed to load prescription details';
      }
    });
  }
}
