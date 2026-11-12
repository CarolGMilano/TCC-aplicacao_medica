import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { NovoPaciente } from './novo-paciente';
import { PacientesService } from '../../services';
import { StatusPaciente, MetodoContraceptivo, StatusFumante } from '../../shared';

describe('NovoPaciente', () => {
  let component: NovoPaciente;
  let fixture: ComponentFixture<NovoPaciente>;
  let router: Router;
  let cadastrarMock: ReturnType<typeof vi.fn>;

  // Simula o cadastro sem acessar a API real.
  beforeEach(() => {
    cadastrarMock = vi.fn().mockReturnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: PacientesService,
          useValue: {
            cadastrarCompleto: cadastrarMock,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(NovoPaciente);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  // Preenche os campos necessários para um cadastro válido.
  function preencherFormularioValido(): void {
    component.formulario.controls.paciente.patchValue({
      nome: 'Maria da Silva',
      dataNascimento: '1990-05-15',
      prontuario: 'TESTE-001',
      status: component.status[0][0] as StatusPaciente,
    });

    component.formulario.controls.dadosGinecoObstetricos.patchValue({
      numGestacao: 2,
      numPartoNormal: 1,
      numCesariana: 1,
      numAborto: 0,
      menarca: 12,
      menopausa: null,
    });

    component.formulario.controls.saudeSexual.patchValue({
      sexarca: 17,
      mac: component.metodos[0][0] as MetodoContraceptivo,
      numParceiros: 2,
      vvs: false,
    });

    component.formulario.controls.historicoIst.setValue(['NENHUMA']);

    component.formulario.controls.historicoTabagismo.patchValue({
      fumante: 'NAO_FUMANTE' as StatusFumante,
      cigarrosDia: null,
      idadeInicio: null,
      idadeFim: null,
    });
  }

  function eventoCheckbox(checked: boolean): Event {
    return {
      target: { checked },
    } as unknown as Event;
  }

  describe('1. Dados pessoais', () => {
    it('não avança com identificação vazia', () => {
      component.continuar();

      expect(component.etapa()).toBe(0);
      expect(component.erro()).toBeTruthy();
    });

    it('exige nome obrigatório', () => {
      const controle = component.formulario.controls.paciente.controls.nome;

      controle.setValue('');

      expect(controle.invalid).toBe(true);
      expect(controle.hasError('required')).toBe(true);
    });

    it('não aceita nome composto apenas por espaços', () => {
      const controle = component.formulario.controls.paciente.controls.nome;

      controle.setValue('   ');

      expect(controle.invalid).toBe(true);
    });

    it('rejeita nome com mais de 45 caracteres', () => {
      const controle = component.formulario.controls.paciente.controls.nome;

      controle.setValue('A'.repeat(46));

      expect(controle.hasError('maxlength')).toBe(true);
    });

    it('não aceita data futura', () => {
      const controle = component.formulario.controls.paciente.controls.dataNascimento;

      controle.setValue('2999-01-01');

      expect(controle.invalid).toBe(true);
    });

    it('aceita uma data de nascimento válida', () => {
      const controle = component.formulario.controls.paciente.controls.dataNascimento;

      controle.setValue('1990-05-15');

      expect(controle.valid).toBe(true);
    });

    it('exige prontuário obrigatório', () => {
      const controle = component.formulario.controls.paciente.controls.prontuario;

      controle.setValue('');

      expect(controle.invalid).toBe(true);
    });

    it('permite avançar quando os dados pessoais são válidos', () => {
      preencherFormularioValido();

      component.continuar();

      expect(component.etapa()).toBe(1);
      expect(component.erro()).toBe('');
    });
  });

  describe('2. Dados gineco-obstétricos', () => {
    it('incrementa o contador de gestações', () => {
      const controle = component.formulario.controls.dadosGinecoObstetricos.controls.numGestacao;

      controle.setValue(2);

      component.ajustarContador('dadosGinecoObstetricos.numGestacao', 1);

      expect(controle.value).toBe(3);
    });

    it('decrementa o contador de gestações', () => {
      const controle = component.formulario.controls.dadosGinecoObstetricos.controls.numGestacao;

      controle.setValue(2);

      component.ajustarContador('dadosGinecoObstetricos.numGestacao', -1);

      expect(controle.value).toBe(1);
    });

    it('não permite contador negativo', () => {
      const controle = component.formulario.controls.dadosGinecoObstetricos.controls.numGestacao;

      controle.setValue(0);

      component.ajustarContador('dadosGinecoObstetricos.numGestacao', -1);

      expect(controle.value).toBe(0);
    });

    it('marca o contador como modificado', () => {
      const controle = component.formulario.controls.dadosGinecoObstetricos.controls.numGestacao;

      component.ajustarContador('dadosGinecoObstetricos.numGestacao', 1);

      expect(controle.dirty).toBe(true);
      expect(controle.touched).toBe(true);
    });

    it('rejeita valores decimais', () => {
      const controle = component.formulario.controls.dadosGinecoObstetricos.controls.numGestacao;

      controle.setValue(1.5);

      expect(controle.invalid).toBe(true);
    });

    it('exige os campos obstétricos obrigatórios', () => {
      preencherFormularioValido();

      component.formulario.controls.dadosGinecoObstetricos.controls.numGestacao.setValue(null);

      component.etapa.set(1);

      expect(component.validarEtapa()).toBe(false);
    });

    it('permite menopausa não informada', () => {
      preencherFormularioValido();

      component.etapa.set(1);

      expect(component.validarEtapa()).toBe(true);
    });
  });

  describe('3. Saúde sexual', () => {
    it('exige método contraceptivo', () => {
      preencherFormularioValido();

      component.formulario.controls.saudeSexual.controls.mac.setValue(null);

      component.etapa.set(2);

      expect(component.validarEtapa()).toBe(false);
    });

    it('exige informação sobre VVS', () => {
      preencherFormularioValido();

      component.formulario.controls.saudeSexual.controls.vvs.setValue(null);

      component.etapa.set(2);

      expect(component.validarEtapa()).toBe(false);
    });

    it('aceita VVS igual a false', () => {
      preencherFormularioValido();

      component.etapa.set(2);

      expect(component.validarEtapa()).toBe(true);
    });

    it('não aceita número negativo de parceiros', () => {
      const controle = component.formulario.controls.saudeSexual.controls.numParceiros;

      controle.setValue(-1);

      expect(controle.invalid).toBe(true);
    });
  });

  describe('4. Histórico de IST', () => {
    it('torna Nenhuma e Não sabe exclusivos', () => {
      const checked = eventoCheckbox(true);

      component.selecionarIst('HPV', checked);
      component.selecionarIst('NENHUMA', checked);

      expect(component.formulario.controls.historicoIst.value).toEqual(['NENHUMA']);

      component.selecionarIst('HIV', checked);

      expect(component.formulario.controls.historicoIst.value).toEqual(['HIV']);
    });

    it('não permite avançar sem selecionar histórico de IST', () => {
      component.etapa.set(3);

      expect(component.validarEtapa()).toBe(false);
    });

    it('exige condiloma quando HPV está selecionado', () => {
      component.selecionarIst('HPV', eventoCheckbox(true));

      component.etapa.set(3);

      expect(component.validarEtapa()).toBe(false);
      expect(component.erro()).toContain('condiloma');
    });

    it('permite HPV quando condiloma está informado', () => {
      component.selecionarIst('HPV', eventoCheckbox(true));

      component.formulario.controls.condilomaHpv.setValue(false);

      component.etapa.set(3);

      expect(component.validarEtapa()).toBe(true);
    });

    it('limpa condiloma ao remover HPV', () => {
      component.selecionarIst('HPV', eventoCheckbox(true));

      component.formulario.controls.condilomaHpv.setValue(true);

      component.selecionarIst('HPV', eventoCheckbox(false));

      expect(component.formulario.controls.condilomaHpv.value).toBeNull();
    });
  });

  describe('5. Tabagismo', () => {
    it('não exige histórico adicional para não fumante', () => {
      preencherFormularioValido();

      component.etapa.set(4);

      expect(component.validarEtapa()).toBe(true);
    });

    it('exige dados adicionais para fumante', () => {
      preencherFormularioValido();

      component.formulario.controls.historicoTabagismo.patchValue({
        fumante: 'FUMANTE' as StatusFumante,
        cigarrosDia: null,
        idadeInicio: null,
      });

      component.etapa.set(4);

      expect(component.validarEtapa()).toBe(false);
    });

    it('rejeita término anterior ao início do tabagismo', () => {
      preencherFormularioValido();

      component.formulario.controls.historicoTabagismo.patchValue({
        fumante: 'EX_FUMANTE' as StatusFumante,
        cigarrosDia: 10,
        idadeInicio: 20,
        idadeFim: 15,
      });

      component.etapa.set(4);

      expect(component.validarEtapa()).toBe(false);
    });

    it('aceita histórico válido de ex-fumante', () => {
      preencherFormularioValido();

      component.formulario.controls.historicoTabagismo.patchValue({
        fumante: 'EX_FUMANTE' as StatusFumante,
        cigarrosDia: 10,
        idadeInicio: 20,
        idadeFim: 30,
      });

      component.etapa.set(4);

      expect(component.validarEtapa()).toBe(true);
    });
  });

  describe('6. Navegação', () => {
    it('avança somente quando os dados são válidos', () => {
      preencherFormularioValido();

      component.continuar();

      expect(component.etapa()).toBe(1);
    });

    it('permite voltar para a etapa anterior', () => {
      component.etapa.set(3);

      component.voltar();

      expect(component.etapa()).toBe(2);
    });

    it('não permite voltar antes da primeira etapa', () => {
      component.etapa.set(0);

      component.voltar();

      expect(component.etapa()).toBe(0);
    });

    it('preserva dados preenchidos ao voltar', () => {
      preencherFormularioValido();

      component.etapa.set(2);
      component.voltar();

      expect(component.formulario.controls.paciente.controls.nome.value).toBe('Maria da Silva');
    });
  });

  describe('7. Payload', () => {
    it('remove espaços extras do nome e prontuário', () => {
      preencherFormularioValido();

      component.formulario.controls.paciente.patchValue({
        nome: '  Maria da Silva  ',
        prontuario: '  TESTE-001  ',
      });

      const payload = component.payload();

      expect(payload.paciente.nome).toBe('Maria da Silva');
      expect(payload.paciente.prontuario).toBe('TESTE-001');
    });

    it('monta o histórico de IST corretamente', () => {
      preencherFormularioValido();

      component.formulario.controls.historicoIst.setValue(['HPV']);

      component.formulario.controls.condilomaHpv.setValue(true);

      const payload = component.payload();

      expect(payload.historicoIst).toEqual([{ ist: 'HPV', condilomaHpv: true }]);
    });

    it('remove dados de tabagismo para não fumante', () => {
      preencherFormularioValido();

      component.formulario.controls.historicoTabagismo.patchValue({
        fumante: 'NAO_FUMANTE' as StatusFumante,
        cigarrosDia: 10,
        idadeInicio: 18,
        idadeFim: 30,
      });

      const payload = component.payload();

      expect(payload.historicoTabagismo.cigarrosDia).toBeNull();
      expect(payload.historicoTabagismo.idadeInicio).toBeNull();
      expect(payload.historicoTabagismo.idadeFim).toBeNull();
    });

    it('mantém os dados pessoais no payload', () => {
      preencherFormularioValido();

      const payload = component.payload();

      expect(payload.paciente.nome).toBe('Maria da Silva');
      expect(payload.paciente.prontuario).toBe('TESTE-001');
      expect(payload.paciente.dataNascimento).toBe('1990-05-15');
    });
  });

  describe('8. Cadastro e comunicação com o backend', () => {
    it('não chama o serviço se o formulário é inválido', () => {
      component.cadastrar();

      expect(cadastrarMock).not.toHaveBeenCalled();
    });

    it('envia o payload uma única vez quando válido', () => {
      preencherFormularioValido();

      // Simula a navegação após o cadastro
      const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      component.cadastrar();

      expect(cadastrarMock).toHaveBeenCalledTimes(1);

      expect(cadastrarMock).toHaveBeenCalledWith(component.payload());

      expect(navegar).toHaveBeenCalledWith(['/pacientes']);
    });

    it('navega para pacientes após cadastro bem-sucedido', () => {
      preencherFormularioValido();

      const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      component.cadastrar();

      expect(navegar).toHaveBeenCalledWith(['/pacientes']);
    });

    it('não permite cadastrar duas vezes durante o loading', () => {
      preencherFormularioValido();

      component.loading.set(true);
      component.cadastrar();

      expect(cadastrarMock).not.toHaveBeenCalled();
    });

    it('trata erro HTTP 409 de prontuário duplicado', () => {
      cadastrarMock.mockReturnValue(throwError(() => ({ status: 409 })));

      preencherFormularioValido();
      component.cadastrar();

      expect(component.etapa()).toBe(0);
      expect(component.erro()).toContain('Já existe');
      expect(component.loading()).toBe(false);
    });

    it('trata erro HTTP 403 de falta de permissão', () => {
      cadastrarMock.mockReturnValue(throwError(() => ({ status: 403 })));

      preencherFormularioValido();
      component.cadastrar();

      expect(component.erro()).toContain('permissão');
      expect(component.loading()).toBe(false);
    });

    it('preserva os dados em caso de erro HTTP 500', () => {
      cadastrarMock.mockReturnValue(throwError(() => ({ status: 500 })));

      preencherFormularioValido();
      component.cadastrar();

      expect(component.formulario.controls.paciente.controls.nome.value).toBe('Maria da Silva');

      expect(component.erro()).toBeTruthy();
      expect(component.loading()).toBe(false);
    });
  });

  describe('9. Interação com o HTML', () => {
    it('renderiza o título da primeira etapa', () => {
      fixture.detectChanges();

      const texto = fixture.nativeElement.textContent;

      expect(texto).toContain('Dados pessoais');
    });

    it('mostra a etapa gineco-obstétrica ao avançar', () => {
      preencherFormularioValido();

      component.continuar();
      fixture.detectChanges();

      const titulo = fixture.nativeElement.querySelector('.card-cabecalho h2');

      expect(titulo?.textContent).toContain('Gineco-obstétricos');
    });

    it('incrementa gestações pelo botão da interface', () => {
      preencherFormularioValido();

      component.etapa.set(1);
      fixture.detectChanges();

      const botoes: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll('.contador-botao');

      // O segundo botão do primeiro contador é o "+".
      expect(botoes.length).toBeGreaterThanOrEqual(2);

      botoes[1].click();

      expect(component.formulario.controls.dadosGinecoObstetricos.controls.numGestacao.value).toBe(
        3,
      );
    });

    it('não avança ao enviar o formulário vazio pelo HTML', () => {
      fixture.detectChanges();

      const formulario: HTMLFormElement = fixture.nativeElement.querySelector('form');

      formulario.dispatchEvent(
        new Event('submit', {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(component.etapa()).toBe(0);
      expect(component.erro()).toBeTruthy();
    });
  });
});
