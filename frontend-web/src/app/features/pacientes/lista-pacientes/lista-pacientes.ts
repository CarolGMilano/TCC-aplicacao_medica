import { Component, OnInit, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { Paciente } from '../models/paciente.model';
import { PacienteService } from '../services/paciente.service';

@Component({
  selector: 'app-lista-pacientes',
  imports: [MatCardModule, MatTableModule],
  templateUrl: './lista-pacientes.html',
  styleUrl: './lista-pacientes.scss',
})
export class ListaPacientes implements OnInit {
  private readonly pacienteService = inject(PacienteService);

  readonly pacientes = signal<Paciente[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal('');

  readonly colunas = ['nome', 'prontuario', 'idade', 'status'];

  ngOnInit(): void {
    this.carregarPacientes();
  }

  private carregarPacientes(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.pacienteService
      .listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (pagina) => {
          this.pacientes.set(pagina.content);
        },
        error: () => {
          this.erro.set('Não foi possível carregar os pacientes.');
        },
      });
  }
}
