import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMedecinComponent } from './update-medecin.component';

describe('UpdateMedecinComponent', () => {
  let component: UpdateMedecinComponent;
  let fixture: ComponentFixture<UpdateMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
