import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPaymentDoneComponent } from './entry-payment-done.component';

describe('EntryPaymentDoneComponent', () => {
  let component: EntryPaymentDoneComponent;
  let fixture: ComponentFixture<EntryPaymentDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryPaymentDoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryPaymentDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
