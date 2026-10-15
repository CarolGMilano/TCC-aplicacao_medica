import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import {
  IConsultaRequest,
  IConsultaResponse,
  StatusPaciente,
  StatusPacienteLabel
} from '../../models';
import { SharedModule } from '../../shared-module';

interface DadosFormulario {
  modo: 'adicionar' | 'visualizar';
  consulta: IConsultaResponse;
  paciente: {
    nome: string;
    status: StatusPaciente;
  };
}

interface DadosSalvarFormulario {
  consulta: IConsultaRequest;
  status: StatusPaciente;
}

@Component({
  selector: 'app-formulario-consulta',
  imports: [
    FormsModule,
    MatIconModule,
    SharedModule,
    DatePipe
  ],
  templateUrl: './formulario-consulta.html',
  styleUrl: './formulario-consulta.scss',
})
export class FormularioConsulta {
  @Output() salvarFormulario =
    new EventEmitter<DadosSalvarFormulario>();

  @ViewChild('formularioForm')
  formularioForm!: NgForm;

  private dialogRef = inject(MatDialogRef<FormularioConsulta>);

  data = inject<DadosFormulario>(MAT_DIALOG_DATA);

  paciente = {
    ...this.data.paciente
  };

  statusEditado: StatusPaciente = this.paciente.status;

  StatusPaciente = StatusPaciente;
  StatusPacienteLabel = StatusPacienteLabel;
  statusOpcoes = Object.values(StatusPaciente);

  consulta: IConsultaResponse = {
    ...this.data.consulta,
    dataHora: this.data.modo === 'adicionar'
      ? this.obterDataHoraLocal()
      : this.data.consulta.dataHora
  };

  private obterDataHoraLocal(): string {
    const agora = new Date();

    const data = [
      agora.getFullYear(),
      String(agora.getMonth() + 1).padStart(2, '0'),
      String(agora.getDate()).padStart(2, '0')
    ].join('-');

    const hora = [
      String(agora.getHours()).padStart(2, '0'),
      String(agora.getMinutes()).padStart(2, '0'),
      String(agora.getSeconds()).padStart(2, '0')
    ].join(':');

    return `${data}T${hora}`;
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
      consulta: this.consulta,
      status: this.statusEditado
    });
  }
}