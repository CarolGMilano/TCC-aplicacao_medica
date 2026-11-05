import { TestBed } from '@angular/core/testing';

import { PcrsService } from './pcrs';

describe('Pcrs', () => {
  let service: PcrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PcrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
