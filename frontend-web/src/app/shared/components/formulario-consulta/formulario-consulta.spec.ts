import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { FormularioConsulta } from './formulario-consulta';
import { IConsultaResponse, StatusPaciente } from '../../models';

describe('FormularioConsulta', () => {
  let component: FormularioConsulta;
  let fixture: ComponentFixture<FormularioConsulta>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const statusInicial = Object.values(StatusPaciente)[0];

  const dadosMock = {
    modo: 'adicionar' as const,
    consulta: {
      idPaciente: 1,
      dataHora: '2026-11-15T14:00:00',
      observacao: 'Consulta de teste',
    } as IConsultaResponse,
    paciente: {
      nome: 'Paciente Teste',
      status: statusInicial,
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FormularioConsulta],
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

    fixture = TestBed.createComponent(FormularioConsulta);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os dados da paciente', () => {
    expect(component.paciente.nome).toBe('Paciente Teste');
    expect(component.statusEditado).toBe(statusInicial);
    expect(component.consulta.idPaciente).toBe(1);
  });

  it('deve fechar o diálogo ao cancelar', () => {
    component.cancelar();

    expect(dialogRefMock.close).toHaveBeenCalledOnce();
  });

  it('não deve salvar um formulário inválido', () => {
    const markAllAsTouched = vi.fn();
    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    const formularioMock = {
      form: {
        valid: false,
        markAllAsTouched,
      },
    } as unknown as NgForm;

    component.salvar(formularioMock);

    expect(markAllAsTouched).toHaveBeenCalledOnce();
    expect(emitir).not.toHaveBeenCalled();
  });

  it('deve emitir os dados quando o formulário for válido', () => {
    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    const formularioMock = {
      form: {
        valid: true,
        markAllAsTouched: vi.fn(),
      },
    } as unknown as NgForm;

    component.salvar(formularioMock);

    expect(emitir).toHaveBeenCalledWith({
      consulta: component.consulta,
      status: component.statusEditado,
    });

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
