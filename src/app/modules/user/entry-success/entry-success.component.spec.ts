import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySuccessComponent } from './entry-success.component';

describe('EntrySuccessComponent', () => {
  let component: EntrySuccessComponent;
  let fixture: ComponentFixture<EntrySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrySuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
