import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { Classificacao, ClassificacaoLabel, IColposcopiaRequest, IColposcopiaResponse, JEC, JECLabel, TipoAchado, TipoAchadoLabel, ZT, ZTLabel } from '../../models';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DadosFormulario {
  modo: 'adicionar' | 'visualizar';
  colposcopiaExistente: IColposcopiaResponse;
  idPaciente: number;
}

@Component({
  selector: 'app-formulario-colposcopia',
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './formulario-colposcopia.html',
  styleUrl: './formulario-colposcopia.scss',
})
export class FormularioColposcopia {
  @Output() salvarFormulario = new EventEmitter<{
    modo: 'adicionar' | 'alterar';
    id?: number;
    dados: IColposcopiaRequest;
  }>();

  @ViewChild('formularioForm')
  formularioForm!: NgForm;

  private dialogRef = inject(MatDialogRef<FormularioColposcopia>);

  data = inject<DadosFormulario>(MAT_DIALOG_DATA);

  modoAtual: 'adicionar' | 'alterar' | 'visualizar' = this.data.modo;

  dataAtual = new Date().toISOString().split('T')[0];

  JEC = JEC;
  JECLabel = JECLabel;
  JECOpcoes = Object.values(JEC);

  ZT = ZT;
  ZTLabel = ZTLabel;
  ZTOpcoes = Object.values(ZT);

  TipoAchado = TipoAchado;
  TipoAchadoLabel = TipoAchadoLabel;
  TipoAchadoOpcoes = Object.values(TipoAchado);

  Classificacao = Classificacao;
  ClassificacaoLabel = ClassificacaoLabel;
  ClassificacaoOpcoes = Object.values(Classificacao);

  colposcopia = this.data.colposcopiaExistente;

  novaColposcopia: IColposcopiaRequest = {
    idPaciente: this.data.idPaciente,
    dataRegistro: this.colposcopia?.dataRegistro ?? '',
    estrogenizacao: this.colposcopia?.estrogenizacao ?? false,
    jec: this.colposcopia?.jec ?? null,
    zt: this.colposcopia?.zt ?? null,
    lesao: this.colposcopia?.lesao ?? false,
    recidiva: this.colposcopia?.recidiva ?? false,
    grauLesao: this.colposcopia?.grauLesao ?? null,
    classificacao: this.colposcopia?.classificacao ?? null,
    observacao: this.colposcopia?.observacao ?? '',
    verETratar: this.colposcopia?.verETratar ?? false,
    verETratarMotivo: this.colposcopia?.verETratarMotivo ?? ''
  }

  editar() {
    this.modoAtual = 'alterar';
  }

  validarData(): boolean {
    const data = this.novaColposcopia.dataRegistro;

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

    const dados: IColposcopiaRequest = {
      ...this.novaColposcopia,

      recidiva: this.novaColposcopia.lesao
        ? this.novaColposcopia.recidiva
        : false,

      verETratar: this.novaColposcopia.lesao
        ? this.novaColposcopia.verETratar
        : false,

      verETratarMotivo: this.novaColposcopia.lesao &&
        this.novaColposcopia.verETratar
          ? this.novaColposcopia.verETratarMotivo.trim()
          : '',

      grauLesao: this.novaColposcopia.lesao
        ? this.novaColposcopia.grauLesao
        : null,

      classificacao: this.novaColposcopia.lesao
        ? this.novaColposcopia.classificacao
        : null
    };

    this.salvarFormulario.emit({
      modo: this.modoAtual === 'adicionar' ? 'adicionar' : 'alterar',
      ...(this.modoAtual === 'alterar'
        ? { id: this.colposcopia!.idColposcopia }
        : {}),
      dados
    });
  }
}
