import { TestBed } from '@angular/core/testing';

import { UserVideoCallService } from './user-video-call.service';

describe('UserVideoCallService', () => {
  let service: UserVideoCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserVideoCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
