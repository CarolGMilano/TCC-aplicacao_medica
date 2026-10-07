import { Component, inject, OnInit, signal } from '@angular/core';
import { CampoBusca, Loading, CabecalhoPagina, IPaciente, StatusPaciente, StatusPacienteLabel, TipoUsuario, RodapeTabela, Exclusao } from '../../shared';
import { MatIconModule } from '@angular/material/icon';
import { PacientesService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-pacientes',
  imports: [
    CampoBusca,
    Loading,
    CabecalhoPagina,
    MatIconModule,
    RodapeTabela,
    RouterLink
],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.scss',
})
export class Pacientes implements OnInit {
  private service = inject(PacientesService);
  private readonly authService = inject(AuthService);

  private dialog = inject(MatDialog);
  private tempoBusca: ReturnType<typeof setTimeout> | null = null;

  pacienteExcluindo: IPaciente | null = null;

  pacientes = signal<IPaciente[]>([]);

  TipoUsuario = TipoUsuario;

  StatusPaciente = StatusPaciente;
  StatusPacienteLabel = StatusPacienteLabel;

  filtroStatus = signal<StatusPaciente | null>(null);

  busca = signal('');
  paginaAtual = signal(0);
  totalPaginas = signal(0);
  totalPacientes = signal(0);

  tipoUsuarioLogado = signal<TipoUsuario | null>(null);

  loading = signal(false);

  ngOnInit() {
    this.listar();

    this.tipoUsuarioLogado.set(this.authService.getTipoUsuario());
  }

  filtrarPorTipo(tipo: StatusPaciente | null) {
    this.filtroStatus.set(tipo);
    this.listar(0);
  }

  buscar(valor: string) {
    this.busca.set(valor);

    if (this.tempoBusca) {
      clearTimeout(this.tempoBusca);
    }

    this.tempoBusca = setTimeout(() => {
      this.listar(0);
    }, 500);
  }

  proximaPagina() {
    if (this.paginaAtual() + 1 < this.totalPaginas()) {
      this.listar(this.paginaAtual() + 1);
    }
  }

  paginaAnterior() {
    if (this.paginaAtual() > 0) {
      this.listar(this.paginaAtual() - 1);
    }
  }

  confirmarExclusao(paciente: IPaciente) {
    this.pacienteExcluindo = paciente;

    const dialogRef = this.dialog.open(Exclusao, {
      width: '500px',
      data: {
        nome: paciente.nome,
        tipoInformacao: 'Prontuário',
        informacao: paciente.prontuario,
        mensagem: 'Todo o histórico da paciente será excluído, incluindo: consultas, citologias, PCR DNA HPV, colposcopias e procedimentos. Esta ação não pode ser desfeita.',
        textoConfirmar: 'paciente'
      }
    });

    dialogRef.afterClosed().subscribe(confirmou => {
      if (confirmou) {
        this.deletar();
      }
    });
  }

  listar(pagina: number = 0) {
    this.loading.set(true);

    this.service.listar(
      pagina,
      10,
      this.busca(),
      this.filtroStatus() ?? undefined
    ).subscribe({
      next: (resposta) => {
        this.pacientes.set(resposta?.content ?? []);
        this.paginaAtual.set(resposta?.page.number ?? 0);
        this.totalPaginas.set(resposta?.page.totalPages ?? 0);
        this.totalPacientes.set(resposta?.page.totalElements ?? 0);
        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar pacientes:', erro);
        this.loading.set(false);
      }
    });
  }

  deletar() {
    if (this.pacienteExcluindo === null) {
      return;
    }

    this.loading.set(true);

    this.service.deletar(this.pacienteExcluindo.idPaciente).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.listar();

        this.loading.set(false);
      },
      error: (erro) => {
        if (erro.status === 404) {
          alert('Paciente não encontrado.');
        } else if (erro.status === 500) {
          alert('Erro interno ao excluir o paciente.');
        } else {
          alert('Erro inesperado ao excluir o paciente.');
        }

        this.loading.set(false);
      }
    });
  }
}
