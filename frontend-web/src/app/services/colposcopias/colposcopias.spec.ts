import { TestBed } from '@angular/core/testing';

import { ColposcopiasService } from './colposcopias';

describe('Colposcopias', () => {
  let service: ColposcopiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColposcopiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
