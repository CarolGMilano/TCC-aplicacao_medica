import { TestBed } from '@angular/core/testing';

import { Pcrs } from './pcrs';

describe('Pcrs', () => {
  let service: Pcrs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pcrs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
