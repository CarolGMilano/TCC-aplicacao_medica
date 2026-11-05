import { TestBed } from '@angular/core/testing';

import { CitologiasService } from './citologias';

describe('Citologias', () => {
  let service: CitologiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitologiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
