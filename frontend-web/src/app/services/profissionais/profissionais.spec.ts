import { TestBed } from '@angular/core/testing';

import { ProfissionalService } from './profissionais';

describe('Profissionais', () => {
  let service: ProfissionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
