import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface DadosConfirmacaoExclusao {
  nome: string,
  informacao: string,
  mensagem: string,
  textoConfirmar: string
}

@Component({
  selector: 'app-exclusao',
  imports: [MatIconModule],
  templateUrl: './exclusao.html',
  styleUrl: './exclusao.scss'
})
export class Exclusao {
  private dialogRef = inject(MatDialogRef<Exclusao>);
  data = inject<DadosConfirmacaoExclusao>(MAT_DIALOG_DATA);

  cancelar() {
    this.dialogRef.close(false);
  }

  confirmar() {
    this.dialogRef.close(true);
  }
}