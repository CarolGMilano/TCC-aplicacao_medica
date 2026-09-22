import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Loading, CabecalhoPagina, IProfissional, TipoUsuario, TipoUsuarioLabel } from '../../shared';
import { PerfilService } from '../../services';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [
    Loading,
    CabecalhoPagina,
    FormsModule,
    MatIconModule
],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  private readonly perfilService = inject(PerfilService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);

  profissional = signal<IProfissional | null>(null);

  editandoNome: boolean = false;
  nomeEditado: string = '';

  senhaAtual: string = '';
  senhaNova: string = '';
  confirmacaoSenha = '';
  erroSenhaAtual: boolean = false;
  mostrarSenhaAtual: boolean = false;
  mostrarSenhaNova: boolean = false;
  mostrarConfirmacaoSenha: boolean = false;

  TipoUsuario = TipoUsuario;
  TipoUsuarioLabel = TipoUsuarioLabel;

  ngOnInit() {
    this.buscarPerfil();
  }

  buscarPerfil() {
    this.perfilService.buscar().subscribe({
      next: (resposta) => {
        this.profissional.set(resposta);
      },
      error: (erro) => {
        console.error('Erro ao buscar perfil:', erro);
      }
    });
  }

  editarNome() {
    const perfil = this.profissional();

    if (!perfil) {
      return;
    }

    this.nomeEditado = perfil.nome;
    this.editandoNome = true;
  }

  cancelarEdicaoNome() {
    this.editandoNome = false;
    this.nomeEditado = '';
  }

  salvarNome() {
    this.loading.set(true);
    
    const nome = this.nomeEditado.trim();

    if (!nome) {
      this.loading.set(false);
      return;
    }

    this.perfilService.atualizarNome(nome).subscribe({
      next: (resposta) => {
        this.profissional.set(resposta);
        this.editandoNome = false;
        this.nomeEditado = '';
        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao atualizar nome:', erro);
        this.loading.set(false);
      }
    });
  }

  alterarSenha() {
    this.loading.set(true);

    const dados = {
      senhaAtual: this.senhaAtual,
      senhaNova: this.senhaNova,
      senhaConf: this.confirmacaoSenha
    };

    this.perfilService.alterarSenha(dados).subscribe({
      next: () => {
        this.senhaAtual = '';
        this.senhaNova = '';
        this.confirmacaoSenha = '';
        this.erroSenhaAtual = false;
        this.loading.set(false);

        this.authService.logout();
        void this.router.navigate(['/login']);
      },
      error: (erro) => {
        console.error('Erro ao alterar senha:', erro.status);

        if (erro.status === 401) {
          this.erroSenhaAtual = true;
        }

        this.loading.set(false);
      }
    });
  }
}