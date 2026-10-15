import { TestBed } from '@angular/core/testing';

import { Citologias } from './citologias';

describe('Citologias', () => {
  let service: Citologias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Citologias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
