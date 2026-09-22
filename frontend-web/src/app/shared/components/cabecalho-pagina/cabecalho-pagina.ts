import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cabecalho-pagina',
  imports: [],
  templateUrl: './cabecalho-pagina.html',
  styleUrl: './cabecalho-pagina.scss',
})
export class CabecalhoPagina {
  @Input() titulo = '';
  @Input() subtitulo = '';
}
