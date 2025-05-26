import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPrescriptionsComponent } from './my-prescriptions.component';

describe('MyPrescriptionsComponent', () => {
  let component: MyPrescriptionsComponent;
  let fixture: ComponentFixture<MyPrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPrescriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
