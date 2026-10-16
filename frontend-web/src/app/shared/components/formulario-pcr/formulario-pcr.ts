import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { 
  IPCRRequest, 
  IPCRResponse, 
  ResultadoPCR, 
  ResultadoPCRLabel, 
  TipoHPV, 
  TipoHPVLabel 
} from '../../models';

interface DadosFormulario {
  modo: 'adicionar' | 'visualizar';
  pcrExistente: IPCRResponse;
  idPaciente: number;
}

@Component({
  selector: 'app-formulario-pcr',
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './formulario-pcr.html',
  styleUrl: './formulario-pcr.scss',
})
export class FormularioPcr {
  @Output() salvarFormulario = new EventEmitter<{
    modo: 'adicionar' | 'alterar';
    id?: number;
    dados: IPCRRequest;
  }>();

  @ViewChild('formularioForm')
  formularioForm!: NgForm;

  private dialogRef = inject(MatDialogRef<FormularioPcr>);

  data = inject<DadosFormulario>(MAT_DIALOG_DATA);

  modoAtual: 'adicionar' | 'alterar' | 'visualizar' = this.data.modo;

  dataAtual = new Date().toISOString().split('T')[0];

  resultadoPCR = ResultadoPCR;
  ResultadoPCRLabel = ResultadoPCRLabel;
  resultadoPCROpcoes = Object.values(ResultadoPCR);
  
  TipoHPV = TipoHPV;
  TipoHPVLabel = TipoHPVLabel;
  tipoHPVOpcoes = Object.values(TipoHPV);

  pcr = this.data.pcrExistente;

  novaPCR: IPCRRequest = {
    idPaciente: this.data.idPaciente,
    dataRegistro: this.pcr?.dataRegistro ?? '',
    resultado: this.pcr?.resultado ?? ResultadoPCR.NEGATIVO,
    tiposHpv: this.pcr?.tiposHpv ?? [],
    observacao: this.pcr?.observacao ?? ''
  };

  editar() {
    this.modoAtual = 'alterar';
  }

  alterarTipoHPV(tipo: TipoHPV, evento: Event): void {
    const checkbox = evento.target as HTMLInputElement;
    const tiposAtuais = this.novaPCR.tiposHpv;

    if (checkbox.checked) {
      if (!tiposAtuais.includes(tipo)) {
        this.novaPCR.tiposHpv = [...tiposAtuais, tipo];
      }
    } else {
      this.novaPCR.tiposHpv = tiposAtuais.filter(
        tipoAtual => tipoAtual !== tipo
      );
    }
  }

  validarData(): boolean {
    const data = this.novaPCR.dataRegistro;

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
      ...this.novaPCR,
      tiposHpv:
        this.novaPCR.resultado === ResultadoPCR.NEGATIVO
          ? []
          : this.novaPCR.tiposHpv
    };

    this.salvarFormulario.emit({
      modo: this.modoAtual === 'adicionar' ? 'adicionar' : 'alterar',
      ...(this.modoAtual === 'alterar'
        ? { id: this.pcr!.idExame }
        : {}),
      dados
    });
  }
}
