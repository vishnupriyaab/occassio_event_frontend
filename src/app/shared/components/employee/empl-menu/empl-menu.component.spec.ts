import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplMenuComponent } from './empl-menu.component';

describe('EmplMenuComponent', () => {
  let component: EmplMenuComponent;
  let fixture: ComponentFixture<EmplMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmplMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
