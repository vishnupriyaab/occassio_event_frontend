import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstpaymentSuccessComponent } from './firstpayment-success.component';

describe('FirstpaymentSuccessComponent', () => {
  let component: FirstpaymentSuccessComponent;
  let fixture: ComponentFixture<FirstpaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstpaymentSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstpaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
