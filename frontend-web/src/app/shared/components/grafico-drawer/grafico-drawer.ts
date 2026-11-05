import { Component, inject } from '@angular/core';
import { IListaPacienteResponse } from '../../models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';

interface IListaDrawerData {
  titulo: string;
  subtitulo: string;
  itens: IListaPacienteResponse[];
}

@Component({
  selector: 'app-grafico-drawer',
  imports: [
    MatIconModule,
    RouterLink,
    SlicePipe
  ],
  templateUrl: './grafico-drawer.html',
  styleUrl: './grafico-drawer.scss',
})
export class GraficoDrawer {
  private dialogRef = inject(MatDialogRef<GraficoDrawer>);
  
  readonly data = inject<IListaDrawerData>(MAT_DIALOG_DATA);

  fechar() {
    this.dialogRef.close(false);
  }
}
