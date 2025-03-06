import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousManagementComponent } from './miscellaneous-management.component';

describe('MiscellaneousManagementComponent', () => {
  let component: MiscellaneousManagementComponent;
  let fixture: ComponentFixture<MiscellaneousManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiscellaneousManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiscellaneousManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
