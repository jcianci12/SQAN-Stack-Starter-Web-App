import { TestBed } from '@angular/core/testing';

import { ProgressiveexportService } from './progressiveexport.service';

describe('ProgressiveexportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgressiveexportService = TestBed.get(ProgressiveexportService);
    expect(service).toBeTruthy();
  });
});
