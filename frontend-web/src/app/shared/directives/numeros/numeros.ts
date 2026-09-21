import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[numeros]',
  standalone: false
})
export class Numeros {
  private elemento = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  aoDigitar() {
    const valor = this.elemento.nativeElement.value;

    this.elemento.nativeElement.value = valor.replace(/\D/g, '');
  }
}