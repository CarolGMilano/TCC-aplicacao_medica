import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[numeros]',
  standalone: false
})
export class Numeros {
  private elemento = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  aoDigitar() {
    const input = this.elemento.nativeElement;
    const valor = input.value;
    const valorNumerico = valor.replace(/\D/g, '');

    if (valor !== valorNumerico) {
      input.value = valorNumerico;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}