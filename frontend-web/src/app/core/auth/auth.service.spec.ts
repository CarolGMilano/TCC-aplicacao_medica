import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { TipoUsuario } from '../../shared/models/EnumTipoUsuario';

describe('AuthService roles', () => {
  let service: AuthService;
  const token = (payload: object) => `e30.${btoa(JSON.stringify(payload))}.assinatura`;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(AuthService);
    sessionStorage.clear();
  });
  afterEach(() => sessionStorage.clear());
  it('lê tipo do JWT e distingue permissões', () => {
    sessionStorage.setItem('cervicare_token', token({ exp: Date.now() / 1000 + 3600, tipo: 'MEDICO' }));
    expect(service.getTipoUsuario()).toBe(TipoUsuario.MEDICO);
    expect(service.possuiAlgumaRole([TipoUsuario.ADMINISTRADOR])).toBe(false);
  });
  it('rejeita token expirado ou sem expiração', () => {
    sessionStorage.setItem('cervicare_token', token({ tipo: 'ADMINISTRADOR' }));
    expect(service.getTipoUsuario()).toBeNull();
    sessionStorage.setItem('cervicare_token', token({ exp: 1, tipo: 'ADMINISTRADOR' }));
    expect(service.estaAutenticado()).toBe(false);
  });
});
