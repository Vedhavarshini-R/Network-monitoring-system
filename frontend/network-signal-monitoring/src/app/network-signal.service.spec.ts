import { TestBed } from '@angular/core/testing';

import { NetworkSignalService } from './network-signal.service';

describe('NetworkSignalService', () => {
  let service: NetworkSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
