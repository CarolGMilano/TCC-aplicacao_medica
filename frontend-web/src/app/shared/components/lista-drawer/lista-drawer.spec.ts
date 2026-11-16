import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { ListaDrawer } from './lista-drawer';
import { StatusPaciente, StatusPacienteLabel } from '../../models';

describe('ListaDrawer', () => {
  let component: ListaDrawer;
  let fixture: ComponentFixture<ListaDrawer>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dadosMock = {
    titulo: 'Ver e tratar sem retorno',
    subtitulo: 'Pacientes com acompanhamento pendente',
    itens: [],
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ListaDrawer],
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

    fixture = TestBed.createComponent(ListaDrawer);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve receber o título corretamente', () => {
    expect(component.data.titulo).toBe('Ver e tratar sem retorno');
  });

  it('deve receber o subtítulo corretamente', () => {
    expect(component.data.subtitulo).toBe('Pacientes com acompanhamento pendente');
  });

  it('deve receber a lista de pendências', () => {
    expect(component.data.itens).toEqual([]);
  });

  it('deve disponibilizar os status de paciente', () => {
    expect(component.StatusPaciente).toBe(StatusPaciente);
    expect(component.StatusPacienteLabel).toBe(StatusPacienteLabel);
  });

  it('deve fechar o diálogo retornando false', () => {
    component.fechar();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('não deve fechar o diálogo automaticamente', () => {
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
