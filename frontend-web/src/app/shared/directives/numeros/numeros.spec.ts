import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Numeros } from './numeros';

@Component({
  selector: 'app-teste-numeros',
  standalone: false,
  template: '<input type="text" numeros />',
})
class TesteNumerosComponent {}

describe('Numeros', () => {
  let fixture: ComponentFixture<TesteNumerosComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TesteNumerosComponent, Numeros],
    }).compileComponents();

    fixture = TestBed.createComponent(TesteNumerosComponent);
    fixture.detectChanges();

    input = fixture.nativeElement.querySelector('input');
  });

  function digitar(valor: string): void {
    input.value = valor;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  it('deve criar o campo com a diretiva aplicada', () => {
    expect(input).toBeTruthy();
  });

  it('deve manter valores que contêm apenas números', () => {
    digitar('12345');

    expect(input.value).toBe('12345');
  });

  it('deve remover letras do valor digitado', () => {
    digitar('abc123');

    expect(input.value).toBe('123');
  });

  it('deve remover letras entre números', () => {
    digitar('12a34b');

    expect(input.value).toBe('1234');
  });

  it('deve remover pontos e hífens', () => {
    digitar('12.345-67');

    expect(input.value).toBe('1234567');
  });

  it('deve remover caracteres não numéricos', () => {
    digitar('a!@#12,34');

    expect(input.value).toBe('1234');
  });

  it('deve deixar o campo vazio quando não houver números', () => {
    digitar('abcdef');

    expect(input.value).toBe('');
  });

  it('deve permitir apagar todo o conteúdo', () => {
    digitar('12345');
    digitar('');

    expect(input.value).toBe('');
  });

  it('não deve disparar um segundo evento quando o valor já for numérico', () => {
    let quantidadeEventos = 0;

    input.addEventListener('input', () => {
      quantidadeEventos++;
    });

    digitar('12345');

    expect(quantidadeEventos).toBe(1);
  });

  it('deve emitir novo evento input quando corrigir o valor', () => {
    let quantidadeEventos = 0;

    input.addEventListener('input', () => {
      quantidadeEventos++;
    });

    digitar('abc123');

    expect(input.value).toBe('123');
    expect(quantidadeEventos).toBe(2);
  });
});
