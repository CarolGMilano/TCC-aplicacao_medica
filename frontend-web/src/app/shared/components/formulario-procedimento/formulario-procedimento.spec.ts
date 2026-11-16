import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { FormularioProcedimento } from './formulario-procedimento';

import { IProcedimentoResponse, TipoProcedimento, TipoMargem } from '../../models';

describe('FormularioProcedimento', () => {
  let component: FormularioProcedimento;
  let fixture: ComponentFixture<FormularioProcedimento>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dadosMock = {
    modo: 'adicionar' as const,
    idPaciente: 1,
    procedimentoExistente: undefined as unknown as IProcedimentoResponse,
  };

  const tipoNaoBiopsia = Object.values(TipoProcedimento).find(
    (tipo) => tipo !== TipoProcedimento.BIOPSIA,
  )!;

  const margemTeste = Object.values(TipoMargem)[0];

  function formularioMock(valid: boolean): NgForm {
    return {
      form: {
        valid,
        markAllAsTouched: vi.fn(),
      },
    } as unknown as NgForm;
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FormularioProcedimento],
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

    fixture = TestBed.createComponent(FormularioProcedimento);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com os dados padrão', () => {
    expect(component.modoAtual).toBe('adicionar');
    expect(component.novoProcedimento.idPaciente).toBe(1);
    expect(component.novoProcedimento.tipo).toBe(TipoProcedimento.BIOPSIA);
    expect(component.novoProcedimento.qtFragmento).toBe(1);
  });

  it('deve fechar o diálogo ao cancelar', () => {
    component.cancelar();

    expect(dialogRefMock.close).toHaveBeenCalledOnce();
  });

  it('deve rejeitar uma data futura', () => {
    component.novoProcedimento.dataRegistro = '2099-01-01';

    expect(component.validarData()).toBe(false);
  });

  it('deve aceitar uma data válida', () => {
    component.novoProcedimento.dataRegistro = '2025-01-15';

    expect(component.validarData()).toBe(true);
  });

  it('não deve emitir evento quando o formulário for inválido', () => {
    const formulario = formularioMock(false);
    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formulario);

    expect(formulario.form.markAllAsTouched).toHaveBeenCalledOnce();
    expect(emitir).not.toHaveBeenCalled();
  });

  it('deve limpar as margens quando o procedimento for biópsia', () => {
    component.novoProcedimento.tipo = TipoProcedimento.BIOPSIA;
    component.novoProcedimento.margemEndocervical = margemTeste;
    component.novoProcedimento.margemEctocervical = margemTeste;

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: {
        ...component.novoProcedimento,
        margemEndocervical: null,
        margemEctocervical: null,
      },
    });
  });

  it('deve preservar as margens quando não for biópsia', () => {
    component.novoProcedimento.tipo = tipoNaoBiopsia;
    component.novoProcedimento.margemEndocervical = margemTeste;
    component.novoProcedimento.margemEctocervical = margemTeste;

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: {
        ...component.novoProcedimento,
        margemEndocervical: margemTeste,
        margemEctocervical: margemTeste,
      },
    });
  });

  it('deve emitir os dados de um novo procedimento', () => {
    component.novoProcedimento.dataRegistro = '2025-01-15';

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: expect.objectContaining({
        idPaciente: 1,
        tipo: TipoProcedimento.BIOPSIA,
        qtFragmento: 1,
      }),
    });
  });

  it('deve mudar para o modo alterar ao editar', () => {
    component.editar();

    expect(component.modoAtual).toBe('alterar');
  });

  it('deve emitir o ID do procedimento ao salvar uma edição', () => {
    component.procedimento = {
      idProcedimento: 42,
      idPaciente: 1,
      dataRegistro: '2025-01-15',
      tipo: TipoProcedimento.BIOPSIA,
    } as IProcedimentoResponse;

    component.novoProcedimento.dataRegistro = '2025-01-15';
    component.editar();

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'alterar',
      id: 42,
      dados: expect.objectContaining({
        idPaciente: 1,
        tipo: TipoProcedimento.BIOPSIA,
      }),
    });
  });
});
