import { TestBed } from '@angular/core/testing';

import { Colposcopias } from './colposcopias';

describe('Colposcopias', () => {
  let service: Colposcopias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Colposcopias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
