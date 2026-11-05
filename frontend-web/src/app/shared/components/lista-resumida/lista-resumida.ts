import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPendenciaResponse, StatusPaciente, StatusPacienteLabel } from '../../models';

import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-lista-resumida',
  imports: [
    MatIconModule,
    DecimalPipe,
    RouterLink,
    SlicePipe
],
  templateUrl: './lista-resumida.html',
  styleUrl: './lista-resumida.scss',
})
export class ListaResumida {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() itens: IPendenciaResponse[] = [];
  @Input() totalPacientes = 0;
  
  @Output() verTodos = new EventEmitter<void>();

  StatusPaciente = StatusPaciente;
  StatusPacienteLabel = StatusPacienteLabel;

  get percentual(): number {
    if (this.totalPacientes === 0) return 0;

    return (this.itens.length / this.totalPacientes) * 100;
  }
}
