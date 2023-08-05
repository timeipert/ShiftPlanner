import { TestBed } from '@angular/core/testing';

import { DatingService } from './dating.service';

describe('DatingService', () => {
  let service: DatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
