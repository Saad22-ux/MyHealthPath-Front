import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrescriptionComponent } from './add-prescription.component';

describe('AddPrescriptionComponent', () => {
  let component: AddPrescriptionComponent;
  let fixture: ComponentFixture<AddPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
