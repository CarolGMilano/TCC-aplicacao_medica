import { TestBed } from '@angular/core/testing';

import { PerfilService } from './perfil';
import { provideHttpClient } from '@angular/common/http';

describe('Perfil', () => {
  let service: PerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(PerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
