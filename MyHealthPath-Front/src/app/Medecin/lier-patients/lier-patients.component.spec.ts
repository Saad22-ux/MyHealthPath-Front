import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LierPatientsComponent } from './lier-patients.component';

describe('LierPatientsComponent', () => {
  let component: LierPatientsComponent;
  let fixture: ComponentFixture<LierPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LierPatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LierPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
