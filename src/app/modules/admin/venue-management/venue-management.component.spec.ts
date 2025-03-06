import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueManagementComponent } from './venue-management.component';

describe('VenueManagementComponent', () => {
  let component: VenueManagementComponent;
  let fixture: ComponentFixture<VenueManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
