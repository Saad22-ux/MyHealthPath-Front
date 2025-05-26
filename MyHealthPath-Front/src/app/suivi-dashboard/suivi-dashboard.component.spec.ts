import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviDashboardComponent } from './suivi-dashboard.component';

describe('SuiviDashboardComponent', () => {
  let component: SuiviDashboardComponent;
  let fixture: ComponentFixture<SuiviDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
