import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IPendenciaResponse, StatusPaciente, StatusPacienteLabel } from '../../models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';

interface IListaDrawerData {
  itens: IPendenciaResponse[];
  titulo: string;
  subtitulo: string;
}

@Component({
  selector: 'app-lista-drawer',
  imports: [
    MatIcon, 
    RouterLink,
    SlicePipe
  ],
  templateUrl: './lista-drawer.html',
  styleUrl: './lista-drawer.scss',
})
export class ListaDrawer {
  private dialogRef = inject(MatDialogRef<ListaDrawer>);

  readonly data = inject<IListaDrawerData>(MAT_DIALOG_DATA);

  StatusPaciente = StatusPaciente;
  StatusPacienteLabel = StatusPacienteLabel;

  fechar() {
    this.dialogRef.close(false);
  }
}
