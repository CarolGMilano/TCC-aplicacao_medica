import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { FormularioPcr } from './formulario-pcr';
import { IPCRResponse, ResultadoPCR, TipoHPV } from '../../models';

describe('FormularioPcr', () => {
  let component: FormularioPcr;
  let fixture: ComponentFixture<FormularioPcr>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dadosMock = {
    modo: 'adicionar' as const,
    idPaciente: 1,
    pcrExistente: undefined as unknown as IPCRResponse,
  };

  const tipoHPVTeste = Object.values(TipoHPV)[0];
  const resultadoPositivo = Object.values(ResultadoPCR).find(
    (resultado) => resultado !== ResultadoPCR.NEGATIVO,
  )!;

  function formularioMock(valid: boolean): NgForm {
    return {
      form: {
        valid,
        markAllAsTouched: vi.fn(),
      },
    } as unknown as NgForm;
  }

  function eventoCheckbox(checked: boolean): Event {
    return {
      target: { checked },
    } as unknown as Event;
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FormularioPcr],
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

    fixture = TestBed.createComponent(FormularioPcr);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com o ID da paciente e resultado negativo', () => {
    expect(component.modoAtual).toBe('adicionar');
    expect(component.novaPCR.idPaciente).toBe(1);
    expect(component.novaPCR.resultado).toBe(ResultadoPCR.NEGATIVO);
    expect(component.novaPCR.tiposHpv).toEqual([]);
  });

  it('deve fechar o diálogo ao cancelar', () => {
    component.cancelar();

    expect(dialogRefMock.close).toHaveBeenCalledOnce();
  });

  it('deve rejeitar data futura', () => {
    component.novaPCR.dataRegistro = '2099-01-01';

    expect(component.validarData()).toBe(false);
  });

  it('deve aceitar uma data válida', () => {
    component.novaPCR.dataRegistro = '2025-01-15';

    expect(component.validarData()).toBe(true);
  });

  it('deve adicionar um tipo de HPV selecionado', () => {
    component.alterarTipoHPV(tipoHPVTeste, eventoCheckbox(true));

    expect(component.novaPCR.tiposHpv).toContain(tipoHPVTeste);
  });

  it('não deve duplicar um tipo de HPV', () => {
    component.alterarTipoHPV(tipoHPVTeste, eventoCheckbox(true));
    component.alterarTipoHPV(tipoHPVTeste, eventoCheckbox(true));

    expect(component.novaPCR.tiposHpv).toEqual([tipoHPVTeste]);
  });

  it('deve remover um tipo de HPV desmarcado', () => {
    component.alterarTipoHPV(tipoHPVTeste, eventoCheckbox(true));
    component.alterarTipoHPV(tipoHPVTeste, eventoCheckbox(false));

    expect(component.novaPCR.tiposHpv).toEqual([]);
  });

  it('não deve salvar um formulário inválido', () => {
    const formulario = formularioMock(false);
    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formulario);

    expect(formulario.form.markAllAsTouched).toHaveBeenCalledOnce();
    expect(emitir).not.toHaveBeenCalled();
  });

  it('deve limpar os tipos de HPV quando o PCR for negativo', () => {
    component.novaPCR.resultado = ResultadoPCR.NEGATIVO;
    component.novaPCR.tiposHpv = [tipoHPVTeste];

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: {
        ...component.novaPCR,
        tiposHpv: [],
      },
    });
  });

  it('deve preservar os tipos de HPV quando o PCR for positivo', () => {
    component.novaPCR.resultado = resultadoPositivo;
    component.novaPCR.tiposHpv = [tipoHPVTeste];

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: {
        ...component.novaPCR,
        tiposHpv: [tipoHPVTeste],
      },
    });
  });

  it('deve mudar para o modo alterar ao editar', () => {
    component.editar();

    expect(component.modoAtual).toBe('alterar');
  });

  it('deve emitir o ID do exame ao salvar uma alteração', () => {
    component.pcr = {
      idExame: 42,
      idPaciente: 1,
      dataRegistro: '2025-01-15',
      resultado: resultadoPositivo,
      tiposHpv: [tipoHPVTeste],
      observacao: 'Exame anterior',
    } as IPCRResponse;

    component.novaPCR = {
      idPaciente: 1,
      dataRegistro: '2025-01-15',
      resultado: resultadoPositivo,
      tiposHpv: [tipoHPVTeste],
      observacao: 'Observação atualizada',
    };

    component.editar();

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'alterar',
      id: 42,
      dados: component.novaPCR,
    });
  });
});
