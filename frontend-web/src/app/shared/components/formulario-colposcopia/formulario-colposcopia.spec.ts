import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { FormularioColposcopia } from './formulario-colposcopia';

import { Classificacao, IColposcopiaResponse, TipoAchado } from '../../models';

describe('FormularioColposcopia', () => {
  let component: FormularioColposcopia;
  let fixture: ComponentFixture<FormularioColposcopia>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dadosMock = {
    modo: 'adicionar' as const,
    idPaciente: 1,
    colposcopiaExistente: undefined as unknown as IColposcopiaResponse,
  };

  function formularioMock(valid: boolean): NgForm {
    return {
      form: {
        valid,
        markAllAsTouched: vi.fn(),
      },
    } as unknown as NgForm;
  }

  function prepararLesao() {
    component.novaColposcopia.lesao = true;
    component.novaColposcopia.recidiva = true;
    component.novaColposcopia.verETratar = true;
    component.novaColposcopia.verETratarMotivo = '  Indicação clínica  ';
    component.novaColposcopia.grauLesao = Object.values(TipoAchado)[0];
    component.novaColposcopia.classificacao = Object.values(Classificacao)[0];
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FormularioColposcopia],
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

    fixture = TestBed.createComponent(FormularioColposcopia);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar no modo adicionar com os dados padrão', () => {
    expect(component.modoAtual).toBe('adicionar');
    expect(component.novaColposcopia.idPaciente).toBe(1);
    expect(component.novaColposcopia.lesao).toBe(false);
    expect(component.novaColposcopia.recidiva).toBe(false);
    expect(component.novaColposcopia.verETratar).toBe(false);
  });

  it('deve fechar o diálogo ao cancelar', () => {
    component.cancelar();

    expect(dialogRefMock.close).toHaveBeenCalledOnce();
  });

  it('deve rejeitar uma data futura', () => {
    component.novaColposcopia.dataRegistro = '2099-01-01';

    expect(component.validarData()).toBe(false);
  });

  it('deve aceitar uma data válida', () => {
    component.novaColposcopia.dataRegistro = '2025-01-15';

    expect(component.validarData()).toBe(true);
  });

  it('não deve emitir evento com formulário inválido', () => {
    const formulario = formularioMock(false);
    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formulario);

    expect(formulario.form.markAllAsTouched).toHaveBeenCalledOnce();
    expect(emitir).not.toHaveBeenCalled();
  });

  it('deve limpar os campos relacionados à lesão quando não houver lesão', () => {
    prepararLesao();

    // Simula a retirada da indicação de lesão.
    component.novaColposcopia.lesao = false;

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: {
        ...component.novaColposcopia,
        recidiva: false,
        verETratar: false,
        verETratarMotivo: '',
        grauLesao: null,
        classificacao: null,
      },
    });
  });

  it('deve preservar os dados relacionados à lesão quando houver lesão', () => {
    prepararLesao();

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: {
        ...component.novaColposcopia,
        verETratarMotivo: 'Indicação clínica',
      },
    });
  });

  it('deve limpar o motivo quando ver e tratar estiver desmarcado', () => {
    prepararLesao();

    component.novaColposcopia.verETratar = false;

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'adicionar',
      dados: {
        ...component.novaColposcopia,
        verETratarMotivo: '',
      },
    });
  });

  it('deve mudar para o modo alterar ao editar', () => {
    component.editar();

    expect(component.modoAtual).toBe('alterar');
  });

  it('deve emitir o ID da colposcopia ao salvar uma alteração', () => {
    component.colposcopia = {
      idColposcopia: 42,
      idPaciente: 1,
      dataRegistro: '2025-01-15',
      lesao: false,
    } as IColposcopiaResponse;

    component.novaColposcopia.dataRegistro = '2025-01-15';

    component.editar();

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      modo: 'alterar',
      id: 42,
      dados: expect.objectContaining({
        idPaciente: 1,
        dataRegistro: '2025-01-15',
        lesao: false,
      }),
    });
  });
});
