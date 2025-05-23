import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationComponent } from './estimation.component';

describe('EstimationComponent', () => {
  let component: EstimationComponent;
  let fixture: ComponentFixture<EstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
