import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { PacienteEdicao } from './paciente-edicao';
import { StatusPaciente } from '../../models';
import { IPacienteEdicaoRequest } from '../../models/IPacienteEdicaoRequest';

describe('PacienteEdicao', () => {
  let component: PacienteEdicao;
  let fixture: ComponentFixture<PacienteEdicao>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dadosPacienteMock: IPacienteEdicaoRequest = {
    nome: 'Paciente Teste',
    prontuario: 'TESTE-001',
    dataNascimento: '1990-05-15',
    status: Object.values(StatusPaciente)[0],
  };

  const dadosMock = {
    paciente: dadosPacienteMock,
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
      imports: [PacienteEdicao],
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

    fixture = TestBed.createComponent(PacienteEdicao);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os dados da paciente', () => {
    expect(component.paciente.nome).toBe('Paciente Teste');
    expect(component.paciente.prontuario).toBe('TESTE-001');
    expect(component.paciente.dataNascimento).toBe('1990-05-15');
  });

  it('deve criar uma cópia independente dos dados recebidos', () => {
    component.paciente.nome = 'Nome Alterado';

    expect(dadosMock.paciente.nome).toBe('Paciente Teste');
    expect(component.paciente.nome).toBe('Nome Alterado');
  });

  it('deve aceitar uma data de nascimento válida', () => {
    component.paciente.dataNascimento = '1990-05-15';

    expect(component.validarDataNascimento()).toBe(true);
  });

  it('deve rejeitar uma data de nascimento futura', () => {
    component.paciente.dataNascimento = '2099-01-01';

    expect(component.validarDataNascimento()).toBe(false);
  });

  it('deve rejeitar uma data anterior a 1900', () => {
    component.paciente.dataNascimento = '1899-12-31';

    expect(component.validarDataNascimento()).toBe(false);
  });

  it('não deve emitir evento com formulário inválido', () => {
    const formulario = formularioMock(false);
    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formulario);

    expect(formulario.form.markAllAsTouched).toHaveBeenCalledOnce();
    expect(emitir).not.toHaveBeenCalled();
  });

  it('deve emitir os dados atualizados quando o formulário for válido', () => {
    component.paciente.nome = 'Paciente Atualizada';
    component.paciente.prontuario = 'TESTE-002';

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(emitir).toHaveBeenCalledWith({
      nome: 'Paciente Atualizada',
      prontuario: 'TESTE-002',
      dataNascimento: '1990-05-15',
      status: dadosPacienteMock.status,
    });
  });

  it('deve marcar um campo com erro personalizado', () => {
    const controle = new FormControl('TESTE-001');

    component.formularioForm = {
      controls: {
        prontuario: controle,
      },
    } as unknown as NgForm;

    component.marcarErro('prontuario', 'prontuarioConflito');

    expect(controle.hasError('prontuarioConflito')).toBe(true);
    expect(controle.touched).toBe(true);
  });

  it('deve fechar o diálogo ao cancelar', () => {
    component.cancelar();

    expect(dialogRefMock.close).toHaveBeenCalledOnce();
  });
});
