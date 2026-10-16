import { TestBed } from '@angular/core/testing';

import { Procedimentos } from './procedimentos';

describe('Procedimentos', () => {
  let service: Procedimentos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Procedimentos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
