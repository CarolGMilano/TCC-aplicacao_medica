import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { Exclusao } from './exclusao';

describe('Exclusao', () => {
  let component: Exclusao;
  let fixture: ComponentFixture<Exclusao>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dadosMock = {
    nome: 'Paciente Teste',
    tipoInformacao: 'Prontuário',
    informacao: 'TESTE-001',
    mensagem: 'Deseja realmente excluir esta paciente?',
    textoConfirmar: 'paciente',
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Exclusao],
      providers: [
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

    fixture = TestBed.createComponent(Exclusao);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve receber os dados da confirmação', () => {
    expect(component.data).toEqual(dadosMock);
  });

  it('deve fechar o diálogo com false ao cancelar', () => {
    component.cancelar();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('deve fechar o diálogo com true ao confirmar', () => {
    component.confirmar();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('não deve fechar o diálogo antes de uma ação', () => {
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
