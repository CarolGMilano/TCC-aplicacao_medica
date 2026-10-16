import { Component, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IProfissionalRequest, TipoUsuario, TipoUsuarioLabel } from '../../models';
import { SharedModule } from '../../shared-module';

interface DadosFormulario {
  modo: 'adicionar' | 'editar';
  profissional: IProfissionalRequest;
}

@Component({
  selector: 'app-formulario',
  imports: [
    FormsModule, 
    MatIconModule,
    SharedModule
  ],
  templateUrl: './formulario.html',
  styleUrl: './formulario.scss',
})
export class Formulario implements OnInit {
  @Output() salvarFormulario = new EventEmitter<IProfissionalRequest>();
  @ViewChild('formularioForm') formularioForm!: NgForm;

  private dialogRef = inject(MatDialogRef<Formulario>);
  
  data = inject<DadosFormulario>(MAT_DIALOG_DATA);

  profissional: IProfissionalRequest = {
    ...this.data.profissional
  };
  
  mostrarSenha = signal(false);
  
  ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
    'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
    'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  
  //Analisar como vamos colocar esses arrays na versão final
  especialidades = [
    'Ginecologia',
    'Obstetrícia',
    'Oncologia'
  ];
  
  ufCrm = this.ufs[0];;
  numeroCrm: string = '';
  
  TipoUsuario = TipoUsuario;
  TipoUsuarioLabel = TipoUsuarioLabel;
  tipoUsuarioOptions = Object.values(TipoUsuario);

  ngOnInit() {
    this.inicializarCrm();
  }

  marcarErro(campo: string, erro: string) {
    const controle = this.formularioForm.controls[campo];

    controle.setErrors({
      ...controle.errors,
      [erro]: true
    });

    controle.markAsTouched();
  }

  inicializarCrm() {
    if (this.data.modo === 'editar' && this.profissional.crm) {
      const [uf, numero] = this.profissional.crm.split(' ');

      this.ufCrm = uf;
      this.numeroCrm = numero;
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  salvar(formulario: NgForm) {
    if (!formulario.form.valid) {
      formulario.form.markAllAsTouched();
      return;
    }

    this.profissional.crm = `${this.ufCrm} ${this.numeroCrm}`;

    this.salvarFormulario.emit(this.profissional);
  }
}