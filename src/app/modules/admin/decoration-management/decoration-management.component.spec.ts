import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecorationManagementComponent } from './decoration-management.component';

describe('DecorationManagementComponent', () => {
  let component: DecorationManagementComponent;
  let fixture: ComponentFixture<DecorationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecorationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecorationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
