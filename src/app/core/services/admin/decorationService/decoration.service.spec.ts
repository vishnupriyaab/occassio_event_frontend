import { TestBed } from '@angular/core/testing';

import { DecorationService } from './decoration.service';

describe('DecorationService', () => {
  let service: DecorationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecorationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
