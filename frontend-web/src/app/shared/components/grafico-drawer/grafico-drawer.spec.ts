import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { GraficoDrawer } from './grafico-drawer';

describe('GraficoDrawer', () => {
  let component: GraficoDrawer;
  let fixture: ComponentFixture<GraficoDrawer>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dadosMock = {
    titulo: 'Distribuição de pacientes por idade',
    subtitulo: 'Pacientes na faixa etária selecionada',
    itens: [],
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [GraficoDrawer],
      providers: [
        provideRouter([]),
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dadosMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoDrawer);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve receber o título corretamente', () => {
    expect(component.data.titulo).toBe('Distribuição de pacientes por idade');
  });

  it('deve receber o subtítulo corretamente', () => {
    expect(component.data.subtitulo).toBe('Pacientes na faixa etária selecionada');
  });

  it('deve receber a lista de pacientes', () => {
    expect(component.data.itens).toEqual([]);
  });

  it('deve fechar o diálogo retornando false', () => {
    component.fechar();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('não deve fechar o diálogo automaticamente', () => {
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
