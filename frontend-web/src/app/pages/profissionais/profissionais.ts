import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

import { PerfilService, ProfissionalService } from '../../services';
import { IProfissional, TipoUsuario, TipoUsuarioLabel, Exclusao, Formulario, Loading, CabecalhoPagina } from '../../shared';

@Component({
  selector: 'app-profissionais',

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    Loading,
    CabecalhoPagina
  ],

  templateUrl: './profissionais.html',
  styleUrl: './profissionais.scss',
})
export class Profissionais implements OnInit {
  private service = inject(ProfissionalService);
  private readonly perfilService = inject(PerfilService);

  private dialog = inject(MatDialog);
  private tempoBusca: ReturnType<typeof setTimeout> | null = null;
  
  profissionais = signal<IProfissional[]>([]);

  profissionalExcluindo: IProfissional | null = null;

  idUsuarioLogado: number | null = null;

  loading = signal(false);
  TipoUsuario = TipoUsuario;
  TipoUsuarioLabel = TipoUsuarioLabel;

  filtroTipo = signal<TipoUsuario | null>(null);

  busca = signal('');
  paginaAtual = signal(0);
  totalPaginas = signal(0);
  totalProfissionais = signal(0);

  ngOnInit() {
    this.listar();

    this.perfilService.buscar().subscribe({
      next: (usuario) => {
        this.idUsuarioLogado = usuario.idUsuario;
      },
      error: (erro) => {
        console.error('Erro ao buscar usuário logado:', erro);
      }
    });
  }

  filtrarPorTipo(tipo: TipoUsuario | null) {
    this.filtroTipo.set(tipo);
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

  abrirFormulario() {
    const dialogRef = this.dialog.open(Formulario, {
      width: '500px',
      data: {
        modo: 'adicionar',
        profissional: {
          nome: '',
          crm: '',
          especialidade: '',
          tipo: TipoUsuario.MEDICO,
          email: '',
          senha: ''
        }
      }
    });
    
    dialogRef.componentInstance.salvarFormulario.subscribe(profissional => {
      this.loading.set(true);

      this.service.inserir(profissional).subscribe({
        next: () => {
          dialogRef.close();
          this.listar();

          this.loading.set(false);
        },
        error: (erro) => {
          console.error('Erro ao cadastrar profissional:', erro.error);

          if (erro.status === 400) {
            if (erro.error?.messages?.email === 'Formato de e-mail inválido') {
              dialogRef.componentInstance.marcarEmailInvalido();
            }
          } else if (erro.status === 409) {
            if (erro.error?.message === 'E-mail já cadastrado no sistema.') {
              dialogRef.componentInstance.marcarEmailConflito();
            }

            if (erro.error?.message === 'CRM já cadastrado no sistema.') {
              dialogRef.componentInstance.marcarCrmConflito();
            }
          }

          this.loading.set(false);
        }
      });
    });
  }

  confirmarExclusao(profissional: IProfissional) {
    this.profissionalExcluindo = profissional;

    const dialogRef = this.dialog.open(Exclusao, {
      width: '500px',
      data: {
        nome: profissional.nome,
        informacao: profissional.crm,
        mensagem: 'O acesso do profissional será removido. Os registros já lançados por ele permanecem no histórico das pacientes.',
        textoConfirmar: 'profissional'
      }
    });

    dialogRef.afterClosed().subscribe(confirmou => {
      if (confirmou) {
        this.deletar();
      }
    });
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

  listar(pagina: number = 0) {
    this.loading.set(true);

    this.service.listar(
      pagina,
      10,
      this.busca(),
      this.filtroTipo() ?? undefined
    ).subscribe({
      next: (resposta) => {
        this.profissionais.set(resposta?.content ?? []);
        this.paginaAtual.set(resposta?.page.number ?? 0);
        this.totalPaginas.set(resposta?.page.totalPages ?? 0);
        this.totalProfissionais.set(resposta?.page.totalElements ?? 0);
        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar profissionais:', erro);
        this.loading.set(false);
      }
    });
  }

  editar(profissional: IProfissional) {
    
    const dialogRef = this.dialog.open(Formulario, {
      width: '500px',
      data: {
        modo: 'editar',
        profissional: {
          nome: profissional.nome,
          crm: profissional.crm,
          especialidade: profissional.especialidade,
          tipo: profissional.tipo,
          email: profissional.email,
          senha: ''
        }
      }
    });
    
    dialogRef.componentInstance.salvarFormulario.subscribe(dados => {
      this.loading.set(true);
      
      this.service.atualizar(
        profissional.idMedico,
        dados
      ).subscribe({
        next: () => {
          dialogRef.close();

          dialogRef.afterClosed().subscribe(() => {
            this.listar();
          });

          this.loading.set(false);
        },
        error: (erro) => {
          console.error('Erro ao editar profissional:', erro);

          if (erro.status === 400) {
            if (erro.error?.messages?.email === 'Formato de e-mail inválido') {
              dialogRef.componentInstance.marcarEmailInvalido();
            }
          } else if (erro.status === 409) {
            if (erro.error?.message === 'E-mail já cadastrado por outro usuário.') {
              dialogRef.componentInstance.marcarEmailConflito();
            }

            if (erro.error?.message === 'CRM já cadastrado por outro profissional.') {
              dialogRef.componentInstance.marcarCrmConflito();
            }
          }

          this.loading.set(false);
        }
      });
    });
  }

  deletar() {
    if (this.profissionalExcluindo === null) {
      return;
    }

    this.loading.set(true);

    this.service.deletar(this.profissionalExcluindo.idMedico).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.listar();

        this.loading.set(false);
      },
      error: (erro) => {
        if (erro.status === 404) {
          alert('Profissional não encontrado.');
        } else if (erro.status === 500) {
          alert('Erro interno ao excluir o profissional.');
        } else {
          alert('Erro inesperado ao excluir o profissional.');
        }

        this.loading.set(false);
      }
    });
  }
}