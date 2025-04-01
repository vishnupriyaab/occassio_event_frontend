import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionHomeComponent } from './subscription-home.component';

describe('SubscriptionHomeComponent', () => {
  let component: SubscriptionHomeComponent;
  let fixture: ComponentFixture<SubscriptionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
