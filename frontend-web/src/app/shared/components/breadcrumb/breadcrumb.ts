import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    RouterLink,
    MatIconModule
  ],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb implements OnInit {
  private readonly router = inject(Router);

  breadcrumbs: { label: string; url?: string }[] = [];

  ngOnInit(): void {
    this.atualizarBreadcrumb(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.atualizarBreadcrumb(event.urlAfterRedirects);
      });
  }

  atualizarBreadcrumb(url: string): void {
    if (url.startsWith('/pacientes/')) {
      this.breadcrumbs = [
        { label: 'Pacientes', url: '/pacientes' },
        { label: 'Paciente' }
      ];
      return;
    }

    if (url.startsWith('/pacientes')) {
      this.breadcrumbs = [
        { label: 'Pacientes' }
      ];
      return;
    }

    if (url.startsWith('/profissionais')) {
      this.breadcrumbs = [
        { label: 'Profissionais' }
      ];
      return;
    }

    if (url.startsWith('/perfil')) {
      this.breadcrumbs = [
        { label: 'Perfil' }
      ];
      return;
    }

    if (url.startsWith('/dashboard')) {
      this.breadcrumbs = [
        { label: 'Dashboard' }
      ];
      return;
    }

    if (url.startsWith('/novo-paciente')) {
      this.breadcrumbs = [
        { label: 'Novo paciente' }
      ];
      return;
    }

    this.breadcrumbs = [];
  }
}