import { TestBed } from '@angular/core/testing';

import { CovidcasescontactsService } from './covidcasescontacts.service';

describe('CovidcasescontactsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CovidcasescontactsService = TestBed.get(CovidcasescontactsService);
    expect(service).toBeTruthy();
  });
});
