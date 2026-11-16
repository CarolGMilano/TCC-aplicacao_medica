import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { Formulario } from './formulario';
import { IProfissionalRequest } from '../../models';

describe('Formulario', () => {
  let component: Formulario;
  let fixture: ComponentFixture<Formulario>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const profissionalMock = {
    nome: 'Profissional Teste',
    crm: '',
    email: 'profissional@teste.com',
  } as IProfissionalRequest;

  const dadosMock = {
    modo: 'adicionar' as const,
    profissional: profissionalMock,
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
      imports: [Formulario],
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

    fixture = TestBed.createComponent(Formulario);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os dados do profissional', () => {
    expect(component.profissional.nome).toBe('Profissional Teste');
    expect(component.profissional.email).toBe('profissional@teste.com');
  });

  it('deve iniciar com a senha oculta', () => {
    expect(component.mostrarSenha()).toBe(false);
  });

  it('deve separar a UF e o número do CRM na edição', () => {
    component.profissional.crm = 'PR 12345';

    // Simula a inicialização com dados de edição.
    component.data.modo = 'editar';
    component.inicializarCrm();

    expect(component.ufCrm).toBe('PR');
    expect(component.numeroCrm).toBe('12345');
  });

  it('deve fechar o diálogo ao cancelar', () => {
    component.cancelar();

    expect(dialogRefMock.close).toHaveBeenCalledOnce();
  });

  it('não deve emitir evento com formulário inválido', () => {
    const formulario = formularioMock(false);
    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formulario);

    expect(formulario.form.markAllAsTouched).toHaveBeenCalledOnce();
    expect(emitir).not.toHaveBeenCalled();
  });

  it('deve montar o CRM e emitir os dados ao salvar', () => {
    component.ufCrm = 'PR';
    component.numeroCrm = '12345';

    const emitir = vi.spyOn(component.salvarFormulario, 'emit');

    component.salvar(formularioMock(true));

    expect(component.profissional.crm).toBe('PR 12345');

    expect(emitir).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Profissional Teste',
        crm: 'PR 12345',
      }),
    );
  });

  it('deve marcar um campo com erro personalizado', () => {
    const controle = new FormControl('valor');

    component.formularioForm = {
      controls: {
        email: controle,
      },
    } as unknown as NgForm;

    component.marcarErro('email', 'emailDuplicado');

    expect(controle.hasError('emailDuplicado')).toBe(true);
    expect(controle.touched).toBe(true);
  });
});
