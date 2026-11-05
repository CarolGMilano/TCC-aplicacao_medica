import { TestBed } from '@angular/core/testing';

import { ProcedimentosService } from './procedimentos';

describe('Procedimentos', () => {
  let service: ProcedimentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcedimentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
