import { Component, inject, signal } from '@angular/core';
import { CabecalhoPagina, Loading, CardKpi, IKPIResponse, TipoUsuario, IPendenciaResponse, ListaResumida, ListaDrawer, GraficoEtario, IGraficoEtarioResponse, GraficoDrawer, GraficoIst, CardIndicador, IstLabel, Ist } from '../../shared';
import { DashboardService } from '../../services';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  imports: [CabecalhoPagina, Loading, CardKpi, RouterLink, ListaResumida, GraficoEtario, GraficoIst, CardIndicador],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard  {
  private readonly dashboardService = inject(DashboardService);
  readonly authService = inject(AuthService);

  private readonly dialog = inject(MatDialog);

  KPIs = signal<IKPIResponse | null>(null);
  pendenciasVerETratar = signal<IPendenciaResponse[] | null>(null);
  pendenciasPosProcedimento = signal<IPendenciaResponse[] | null>(null);

  loading = signal(false);

  TipoUsuario = TipoUsuario;

  TipoIST = Ist;
  TipoISTLabel = IstLabel;

  ngOnInit() {
    this.buscarKPI();
    this.listarPendenciaVerETratar();
    this.listarPendenciaPosProcedimento();
  }

  abrirPendencias(itens: IPendenciaResponse[], tipo: string): void {
    if(tipo === 'ver-e-tratar'){
      this.dialog.open(ListaDrawer, {
        data: {
          itens,
          titulo: 'Ver e tratar sem retorno',
          subtitulo: 'Indicação de ver e tratar há mais de 2 meses sem nova consulta registrada'
        },
        position: { top: '0', right: '0' },
        width: '550px',
        maxWidth: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        panelClass: 'painel-pendencias-dialog',
        autoFocus: false
      });
    }

    if(tipo === 'pos-procedimento'){
      this.dialog.open(ListaDrawer, {
        data: {
          itens,
          titulo: 'Pós-procedimento sem retorno',
          subtitulo: 'Biópsia ou EZT realizada há mais de 3 meses sem consulta de acompanhamento'
        },
        position: { top: '0', right: '0' },
        width: '550px',
        maxWidth: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        panelClass: 'painel-pendencias-dialog',
        autoFocus: false
      });
    }
  }

  abrirVerETratar(): void {
    this.abrirPendencias(
      this.pendenciasVerETratar() ?? [], 
      'ver-e-tratar'
    );
  }

  abrirPosProcedimento(): void {
    this.abrirPendencias(
      this.pendenciasPosProcedimento() ?? [],
      'pos-procedimento'
    );
  }

  buscarKPI() {
    this.loading.set(true);

    this.dashboardService.buscarKPI().subscribe({
      next: (resposta) => {
        this.KPIs.set(resposta);
        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar perfil:', erro);
        this.loading.set(false);
      }
    });
  }

  listarPendenciaVerETratar() {
    this.loading.set(true);

    this.dashboardService.listarPendenciaVerETratar().subscribe({
      next: (resposta) => {
        this.pendenciasVerETratar.set(resposta);
        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao listra pendências:', erro);
        this.loading.set(false);
      }
    });
  }

  listarPendenciaPosProcedimento() {
    this.loading.set(true);

    this.dashboardService.listarPosProcedimento().subscribe({
      next: (resposta) => {
        this.pendenciasPosProcedimento.set(resposta);
        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao listra pendências:', erro);
        this.loading.set(false);
      }
    });
  }

  abrirPacientesPorFaixaEtaria(faixa: string): void {
    this.dashboardService.pacientesPorFaixaEtaria(faixa).subscribe({
      next: (pacientes) => {
        this.dialog.open(GraficoDrawer, {
          data: {
            titulo: 'Distribuição de pacientes por idade',
            subtitulo: `${pacientes.length} pacientes com ${faixa} anos`,
            itens: pacientes
          },
          position: { top: '0', right: '0' },
          width: '420px',
          maxWidth: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          panelClass: 'grafico-dialog',
          autoFocus: false,
        });
      },
      error: (erro) => {
        console.error('Erro ao buscar pacientes por faixa etária:', erro);
      },
    });
  }

  abrirPacientesPorIST(ist: string): void {
    this.dashboardService.pacientesPorIST(ist).subscribe({
      next: (pacientes) => {
        let subtitulo: string;

        switch (ist) {
          case Ist.NENHUMA:
            subtitulo = `${pacientes.length} pacientes sem IST registrada`;
            break;

          case Ist.NAO_SABE:
            subtitulo = `${pacientes.length} pacientes sem informação sobre IST`;
            break;

          default:
            subtitulo = `${pacientes.length} pacientes com registro de ${this.TipoISTLabel[ist as keyof typeof this.TipoISTLabel]}`;
        }

        this.dialog.open(GraficoDrawer, {
          data: {
            titulo: 'Distribuição de pacientes por IST',
            subtitulo,
            itens: pacientes
          },
          position: { top: '0', right: '0' },
          width: '420px',
          maxWidth: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          panelClass: 'grafico-dialog',
          autoFocus: false,
        });
      },
      error: (erro) => {
        console.error('Erro ao buscar pacientes por IST:', erro);
      },
    });
  }

  abrirDrawerIndicador(tipo: string): void {
    if (tipo === 'recidiva') {
      this.dashboardService.pacientesRecidiva().subscribe({
        next: (pacientes) => {
          this.dialog.open(GraficoDrawer, {
            data: {
              titulo: 'Distribuição de pacientes',
              subtitulo: `${pacientes.length} pacientes possuem lesões recidivas`,
              itens: pacientes
            },
            position: { top: '0', right: '0' },
            width: '420px',
            maxWidth: '100vw',
            height: '100vh',
            maxHeight: '100vh',
            panelClass: 'grafico-dialog',
            autoFocus: false,
          });
        },
        error: (erro) => {
          console.error('Erro ao buscar pacientes recidivas:', erro);
        },
      });
    }

    if (tipo === 'ver-e-tratar') {
      this.dashboardService.pacientesVerETratar().subscribe({
        next: (pacientes) => {
          this.dialog.open(GraficoDrawer, {
            data: {
              titulo: 'Distribuição de pacientes',
              subtitulo: `${pacientes.length} pacientes com indicação de ver e tratar`,
              itens: pacientes
            },
            position: { top: '0', right: '0' },
            width: '420px',
            maxWidth: '100vw',
            height: '100vh',
            maxHeight: '100vh',
            panelClass: 'grafico-dialog',
            autoFocus: false,
          });
        },
        error: (erro) => {
          console.error('Erro ao buscar pacientes ver e tratar:', erro);
        },
      });
    }
  }
}
