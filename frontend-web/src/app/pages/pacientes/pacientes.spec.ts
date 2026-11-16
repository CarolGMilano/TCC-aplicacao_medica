import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Pacientes } from './pacientes';
import { PacientesService } from '../../services';
import { AuthService } from '../../core/auth/auth.service';

describe('Pacientes', () => {
  let component: Pacientes;
  let fixture: ComponentFixture<Pacientes>;

  const pacientesServiceMock = {
    listar: vi.fn(),
  };

  const authServiceMock = {
    getTipoUsuario: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    pacientesServiceMock.listar.mockReturnValue(
      of({
        content: [],
        page: {
          number: 0,
          totalPages: 0,
          totalElements: 0,
        },
      }),
    );

    authServiceMock.getTipoUsuario.mockReturnValue(null);

    await TestBed.configureTestingModule({
      imports: [Pacientes],
      providers: [
        provideRouter([]),
        {
          provide: PacientesService,
          useValue: pacientesServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Pacientes);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente Pacientes', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar a primeira página de pacientes', () => {
    expect(pacientesServiceMock.listar).toHaveBeenCalledWith(0, 10, '', undefined);
  });

  it('deve iniciar com a lista vazia', () => {
    expect(component.pacientes()).toEqual([]);
    expect(component.totalPacientes()).toBe(0);
  });
});
