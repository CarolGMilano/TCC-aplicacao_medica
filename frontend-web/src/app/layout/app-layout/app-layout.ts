import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { PerfilService } from '../../services';
import { IProfissional } from '../../shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly perfilService = inject(PerfilService);
  private readonly router = inject(Router);

  perfil = signal<IProfissional | null>(null);

  ngOnInit() {
    this.perfilService.buscar().subscribe({
      next: (resposta) => {
        this.perfil.set(resposta);
      },
      error: (erro) => {
        console.error('Erro ao buscar perfil:', erro);
      }
    });
  }

  iniciaisNome(nome: string | undefined): string {
    if (!nome) {
      return '';
    }

    return nome
      .split(' ')
      .filter(palavra => palavra.length > 0)
      .slice(0, 2)
      .map(palavra => palavra[0])
      .join('')
      .toUpperCase();
  }

  sair(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
