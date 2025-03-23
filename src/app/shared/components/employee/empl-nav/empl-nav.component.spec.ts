import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplNavComponent } from './empl-nav.component';

describe('EmplNavComponent', () => {
  let component: EmplNavComponent;
  let fixture: ComponentFixture<EmplNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
