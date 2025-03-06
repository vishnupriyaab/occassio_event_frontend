import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundManagementComponent } from './sound-management.component';

describe('SoundManagementComponent', () => {
  let component: SoundManagementComponent;
  let fixture: ComponentFixture<SoundManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
