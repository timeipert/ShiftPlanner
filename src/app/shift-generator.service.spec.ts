import { TestBed } from '@angular/core/testing';

import { ShiftGeneratorService } from './shift-generator.service';

describe('ShiftGeneratorService', () => {
  let service: ShiftGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
