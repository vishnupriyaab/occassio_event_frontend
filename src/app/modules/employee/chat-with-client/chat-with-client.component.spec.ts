import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWithClientComponent } from './chat-with-client.component';

describe('ChatWithClientComponent', () => {
  let component: ChatWithClientComponent;
  let fixture: ComponentFixture<ChatWithClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWithClientComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWithClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
