import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { 
  IProcedimentoRequest, 
  IProcedimentoResponse, 
  ResultadoProcedimento, 
  ResultadoProcedimentoLabel, 
  TipoMargem, 
  TipoMargemLabel, 
  TipoProcedimento, 
  TipoProcedimentoLabel 
} from '../../models';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormularioColposcopia } from '../formulario-colposcopia/formulario-colposcopia';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface DadosFormulario {
  modo: 'adicionar' | 'visualizar';
  procedimentoExistente: IProcedimentoResponse;
  idPaciente: number;
}

@Component({
  selector: 'app-formulario-procedimento',
  imports: [
    FormsModule,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './formulario-procedimento.html',
  styleUrl: './formulario-procedimento.scss',
})
export class FormularioProcedimento {
  @Output() salvarFormulario = new EventEmitter<{
    modo: 'adicionar' | 'alterar';
    id?: number;
    dados: IProcedimentoRequest;
  }>();

  @ViewChild('formularioForm')
  formularioForm!: NgForm;

  private dialogRef = inject(MatDialogRef<FormularioColposcopia>);

  data = inject<DadosFormulario>(MAT_DIALOG_DATA);

  modoAtual: 'adicionar' | 'alterar' | 'visualizar' = this.data.modo;

  dataAtual = new Date().toISOString().split('T')[0];

  TipoProcedimento = TipoProcedimento;
  TipoProcedimentoLabel = TipoProcedimentoLabel;
  TipoProcedimentoOpcoes = Object.values(TipoProcedimento);
  
  TipoMargem = TipoMargem;
  TipoMargemLabel = TipoMargemLabel;
  TipoMargemOpcoes = Object.values(TipoMargem);

  ResultadoProcedimento = ResultadoProcedimento;
  ResultadoProcedimentoLabel = ResultadoProcedimentoLabel;
  ResultadoProcedimentoOpcoes = Object.values(ResultadoProcedimento);

  procedimento = this.data.procedimentoExistente;

  novoProcedimento: IProcedimentoRequest = {
    idPaciente: this.data.idPaciente,
    dataRegistro: this.procedimento?.dataRegistro ?? '',
    tipo: this.procedimento?.tipo ?? TipoProcedimento.BIOPSIA,
    qtFragmento: this.procedimento?.qtFragmento ?? 1,
    margemEndocervical: this.procedimento?.margemEndocervical ?? null,
    margemEctocervical: this.procedimento?.margemEctocervical ?? null,
    resultado: this.procedimento?.resultado ?? '' as ResultadoProcedimento,
    observacao: this.procedimento?.observacao ?? ''
  }

  editar() {
    this.modoAtual = 'alterar';
  }

  validarData(): boolean {
    const data = this.novoProcedimento.dataRegistro;

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

    const dados = {
      ...this.novoProcedimento,

      margemEndocervical:
        this.novoProcedimento.tipo !== TipoProcedimento.BIOPSIA
          ? this.novoProcedimento.margemEndocervical
          : null,

      margemEctocervical:
        this.novoProcedimento.tipo !== TipoProcedimento.BIOPSIA
          ? this.novoProcedimento.margemEctocervical
          : null
    };

    this.salvarFormulario.emit({
      modo: this.modoAtual === 'adicionar' ? 'adicionar' : 'alterar',
      ...(this.modoAtual === 'alterar'
        ? { id: this.procedimento!.idProcedimento }
        : {}),
      dados
    });
  }
}
