import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnapprovedMedecinsComponent } from './unapproved-medecins.component';

describe('UnapprovedMedecinsComponent', () => {
  let component: UnapprovedMedecinsComponent;
  let fixture: ComponentFixture<UnapprovedMedecinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnapprovedMedecinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnapprovedMedecinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
