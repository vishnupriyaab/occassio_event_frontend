import { TestBed } from '@angular/core/testing';
import { ChatWithEmployeeService } from './chat-with-employee.service';


describe('ChatWithEmployeeService', () => {
  let service: ChatWithEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatWithEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
