import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-campo-busca',
  imports: [
    FormsModule,
    MatIconModule
  ],
  templateUrl: './campo-busca.html',
  styleUrl: './campo-busca.scss',
})
export class CampoBusca {
  @Input() placeholder = 'Buscar...';

  @Output() buscaChange = new EventEmitter<string>();

  valor = '';

  buscar(valor: string) {
    this.valor = valor;
    this.buscaChange.emit(valor);
  }
}
