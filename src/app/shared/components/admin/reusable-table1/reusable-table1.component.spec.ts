import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableTable1Component } from './reusable-table1.component';

describe('ReusableTable1Component', () => {
  let component: ReusableTable1Component;
  let fixture: ComponentFixture<ReusableTable1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableTable1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableTable1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
