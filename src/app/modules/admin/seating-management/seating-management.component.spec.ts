import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatingManagementComponent } from './seating-management.component';

describe('SeatingManagementComponent', () => {
  let component: SeatingManagementComponent;
  let fixture: ComponentFixture<SeatingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatingManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
