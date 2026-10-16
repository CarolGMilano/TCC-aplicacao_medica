import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NovoPaciente } from './novo-paciente';

describe('NovoPaciente', () => {
  let component: NovoPaciente;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideRouter([])] });
    component = TestBed.createComponent(NovoPaciente).componentInstance;
  });
  it('não avança com identificação vazia', () => {
    component.continuar();
    expect(component.etapa()).toBe(0);
    expect(component.erro()).toBeTruthy();
  });
  it('não aceita data futura', () => {
    component.formulario.controls.paciente.controls.dataNascimento.setValue('2999-01-01');
    expect(component.formulario.controls.paciente.controls.dataNascimento.invalid).toBe(true);
  });
  it('torna Nenhuma e Não sabe exclusivos', () => {
    const checked = { target: { checked: true } } as unknown as Event;
    component.selecionarIst('HPV', checked);
    component.selecionarIst('NENHUMA', checked);
    expect(component.formulario.controls.historicoIst.value).toEqual(['NENHUMA']);
    component.selecionarIst('HIV', checked);
    expect(component.formulario.controls.historicoIst.value).toEqual(['HIV']);
  });
});
