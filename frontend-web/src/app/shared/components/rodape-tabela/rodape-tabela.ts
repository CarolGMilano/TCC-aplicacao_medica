import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rodape-tabela',
  imports: [MatIconModule],
  templateUrl: './rodape-tabela.html',
  styleUrl: './rodape-tabela.scss',
})
export class RodapeTabela {
  @Input() paginaAtual = 0;
  @Input() totalPaginas = 0;
  @Input() totalItens = 0;
  @Input() filtroDescricao = '';
  @Input() itensPorPagina = 10;
  @Input() descricaoItens = 'itens';
  @Input() detalheFiltro = '';

  @Output() paginaAnterior = new EventEmitter<void>();
  @Output() proximaPagina = new EventEmitter<void>();

  get primeiroItem(): number {
    return this.totalItens === 0
      ? 0
      : this.paginaAtual * this.itensPorPagina + 1;
  }

  get ultimoItem(): number {
    return Math.min(
      (this.paginaAtual + 1) * this.itensPorPagina,
      this.totalItens
    );
  }
}