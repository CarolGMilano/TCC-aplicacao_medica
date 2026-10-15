import { TestBed } from '@angular/core/testing';

import { ConsultasService } from './consultas';

describe('ConsultasService', () => {
  let service: ConsultasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
