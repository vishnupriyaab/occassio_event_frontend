import { TestBed } from '@angular/core/testing';

import { ChatWithClientService } from './chat-with-client.service';

describe('ChatWithClientService', () => {
  let service: ChatWithClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatWithClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
