import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import {
  ICitologiaRequest,
  ICitologiaResponse,
  ResultadoCitologia,
  ResultadoCitologiaLabel
} from '../../models';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

interface DadosFormulario {
  modo: 'adicionar' | 'visualizar';
  citologiaExistente: ICitologiaResponse;
  idPaciente: number;
}

@Component({
  selector: 'app-formulario-citologia',
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './formulario-citologia.html',
  styleUrl: './formulario-citologia.scss',
})
export class FormularioCitologia {
  @Output() salvarFormulario = new EventEmitter<{
    modo: 'adicionar' | 'alterar';
    id?: number;
    dados: ICitologiaRequest;
  }>();

  @ViewChild('formularioForm')
  formularioForm!: NgForm;

  private dialogRef = inject(MatDialogRef<FormularioCitologia>);

  data = inject<DadosFormulario>(MAT_DIALOG_DATA);

  modoAtual: 'adicionar' | 'alterar' | 'visualizar' = this.data.modo;

  dataAtual = new Date().toISOString().split('T')[0];

  ResultadoCitologia = ResultadoCitologia;
  ResultadoCitologiaLabel = ResultadoCitologiaLabel;
  resultadoCitologiaOpcoes = Object.values(ResultadoCitologia);

  citologia = this.data.citologiaExistente;

  novaCitologia: ICitologiaRequest = {
    idPaciente: this.data.idPaciente,
    dataRegistro: this.citologia?.dataRegistro ?? '',
    resultado: this.citologia?.resultado ?? '' as ResultadoCitologia,
    observacao: this.citologia?.observacao ?? ''
  };

  editar() {
    this.modoAtual = 'alterar';
  }

  validarData(): boolean {
    const data = this.novaCitologia.dataRegistro;

    return data >= '1900-01-01' && data <= this.dataAtual;
  }

  cancelar() {
    this.dialogRef.close();
  }

  salvar(formulario: NgForm) {
    if (!formulario.form.valid) {
      formulario.form.markAllAsTouched();
      return;
    }

    this.salvarFormulario.emit({
      modo: this.modoAtual === 'adicionar' ? 'adicionar' : 'alterar',
      ...(this.modoAtual === 'alterar'
        ? { id: this.citologia!.idExame }
        : {}),
      dados: this.novaCitologia
    });
  }
}
