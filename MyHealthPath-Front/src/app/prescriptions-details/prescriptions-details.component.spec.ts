import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionsDetailsComponent } from './prescriptions-details.component';

describe('PrescriptionsDetailsComponent', () => {
  let component: PrescriptionsDetailsComponent;
  let fixture: ComponentFixture<PrescriptionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
