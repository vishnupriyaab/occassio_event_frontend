import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplMainComponent } from './empl-main.component';

describe('EmplMainComponent', () => {
  let component: EmplMainComponent;
  let fixture: ComponentFixture<EmplMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
