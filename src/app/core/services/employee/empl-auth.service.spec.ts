import { TestBed } from '@angular/core/testing';

import { EmplAuthService } from './empl-auth.service';

describe('EmplAuthService', () => {
  let service: EmplAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmplAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
