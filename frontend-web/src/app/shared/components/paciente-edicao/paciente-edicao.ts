import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPacienteEdicaoRequest } from '../../models/IPacienteEdicaoRequest';
import { StatusPaciente, StatusPacienteLabel } from '../../models';

interface DadosPaciente {
  paciente: IPacienteEdicaoRequest;
}

@Component({
  selector: 'app-paciente-edicao',
  imports: [
    FormsModule
  ],
  templateUrl: './paciente-edicao.html',
  styleUrl: './paciente-edicao.scss',
})
export class PacienteEdicao {
  @Output() salvarFormulario = new EventEmitter<IPacienteEdicaoRequest>();
  @ViewChild('formularioForm') formularioForm!: NgForm;

  private dialogRef = inject(MatDialogRef<PacienteEdicao>);

  data = inject<DadosPaciente>(MAT_DIALOG_DATA);

  paciente: IPacienteEdicaoRequest = {
    ...this.data.paciente
  };

  StatusPaciente = StatusPaciente;
  StatusPacienteLabel = StatusPacienteLabel;
  statusOptions = Object.values(StatusPaciente);

  dataAtual = new Date().toISOString().split('T')[0];

  marcarErro(campo: string, erro: string) {
    const controle = this.formularioForm.controls[campo];

    controle.setErrors({
      ...controle.errors,
      [erro]: true
    });

    controle.markAsTouched();
  }

  validarDataNascimento(): boolean {
    const data = this.paciente.dataNascimento;

    return data >= '1900-01-01' && data <= this.dataAtual;
  }

  salvar(formulario: NgForm) {
    if (!formulario.form.valid) {
      formulario.form.markAllAsTouched();
      return;
    }

    this.salvarFormulario.emit(this.paciente);
  }

  cancelar() {
    this.dialogRef.close();
  }
}