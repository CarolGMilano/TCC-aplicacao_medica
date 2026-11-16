import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { FormularioCitologia } from './formulario-citologia';
import { ICitologiaResponse } from '../../models';

describe('FormularioCitologia', () => {
  let component: FormularioCitologia;
  let fixture: ComponentFixture<FormularioCitologia>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dadosMock = {
    modo: 'adicionar' as const,
    idPaciente: 1,
    citologiaExistente: undefined as unknown as ICitologiaResponse,
  };

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
      imports: [FormularioCitologia],
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

    fixture = TestBed.createComponent(FormularioCitologia);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar no modo adicionar com o ID da paciente', () => {
    expect(component.modoAtual).toBe('adicionar');
    expect(component.novaCitologia.idPaciente).toBe(1);
  });

  it('deve fechar o diálogo ao cancelar', () => {
    component.cancelar();

    expect(dialogRefMock.close).toHaveBeenCalledOnce();
  });

  it('deve rejeitar uma data futura', () => {
    component.novaCitologia.dataRegistro = '2099-01-01';

    expect(component.validarData()).toBe(false);
  });

  it('deve aceitar uma data válida', () => {
    component.novaCitologia.dataRegistro = '2025-01-15';

    expect(component.validarData()).toBe(true);
  });

  it('não deve emitir evento com formulário inválido', () => {
    const formulario = formularioMock(false);
    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formulario);

    expect(formulario.form.markAllAsTouched).toHaveBeenCalledOnce();
    expect(emitir).not.toHaveBeenCalled();
  });

  it('deve emitir os dados de uma nova citologia', () => {
    component.novaCitologia.dataRegistro = '2025-01-15';

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: component.novaCitologia,
    });
  });

  it('deve mudar para o modo alterar ao editar', () => {
    component.editar();

    expect(component.modoAtual).toBe('alterar');
  });

  it('deve emitir o ID do exame ao salvar uma alteração', () => {
    const citologiaExistente = {
      idExame: 42,
      idPaciente: 1,
      dataRegistro: '2025-01-15',
      resultado: component.resultadoCitologiaOpcoes[0],
      observacao: 'Citologia anterior',
    } as ICitologiaResponse;

    component.citologia = citologiaExistente;
    component.novaCitologia = {
      idPaciente: 1,
      dataRegistro: '2025-01-15',
      resultado: citologiaExistente.resultado,
      observacao: 'Observação atualizada',
    };

    component.editar();

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'alterar',
      id: 42,
      dados: component.novaCitologia,
    });
  });
});
