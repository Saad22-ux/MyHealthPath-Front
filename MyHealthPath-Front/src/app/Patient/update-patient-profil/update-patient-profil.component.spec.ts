import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePatientProfilComponent } from './update-patient-profil.component';

describe('UpdatePatientProfilComponent', () => {
  let component: UpdatePatientProfilComponent;
  let fixture: ComponentFixture<UpdatePatientProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePatientProfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePatientProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
