import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWithEmployeeComponent } from './chat-with-employee.component';

describe('ChatWithEmployeeComponent', () => {
  let component: ChatWithEmployeeComponent;
  let fixture: ComponentFixture<ChatWithEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWithEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWithEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
