import { TestBed } from '@angular/core/testing';

import { StoresOwnedService } from './store.service';

describe('StoreService', () => {
  let service: StoresOwnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoresOwnedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
