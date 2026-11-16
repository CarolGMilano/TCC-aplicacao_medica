import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { EMPTY } from 'rxjs';
import { vi } from 'vitest';

import { Paciente } from './paciente';
import { PacientesService } from '../../services';

describe('Paciente', () => {
  let component: Paciente;
  let fixture: ComponentFixture<Paciente>;

  const pacientesServiceMock = {
    buscar: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Não realiza chamadas HTTP reais durante o teste.
    pacientesServiceMock.buscar.mockReturnValue(EMPTY);

    await TestBed.configureTestingModule({
      imports: [Paciente],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        {
          provide: PacientesService,
          useValue: pacientesServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Paciente);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente Paciente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar o paciente com o ID informado na rota', () => {
    expect(pacientesServiceMock.buscar).toHaveBeenCalledWith(1);
  });
});
