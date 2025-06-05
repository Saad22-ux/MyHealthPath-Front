import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionService } from '../services/prescription.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescriptions-details.component.html',
  imports: [RouterModule,NgFor,NgIf,CommonModule,FormsModule],
  styleUrls: ['./prescriptions-details.component.css']
})
export class PrescriptionsDetailsComponent implements OnInit {
  prescriptionId!: number;
  prescription: any;
  error: string = '';
  statusMessage = '';

  userRole: string = '';

  canSubmit: boolean = true;

  constructor(private route: ActivatedRoute, private prescriptionService: PrescriptionService, private authService: AuthService) {}

  ngOnInit(): void {
    this.prescriptionId = Number(this.route.snapshot.paramMap.get('id'));

    this.prescriptionService.getPrescriptionDetails(this.prescriptionId).subscribe({
      next: (res: any) => {
        this.prescription = res.prescription;
        this.statusMessage = res.message || 'Details fetched successfully';
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load prescription details';
      }
    });
  }
}
