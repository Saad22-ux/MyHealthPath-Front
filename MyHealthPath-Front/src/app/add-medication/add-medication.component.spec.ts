import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicationComponent } from './add-medication.component';

describe('AddMedicationComponent', () => {
  let component: AddMedicationComponent;
  let fixture: ComponentFixture<AddMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
