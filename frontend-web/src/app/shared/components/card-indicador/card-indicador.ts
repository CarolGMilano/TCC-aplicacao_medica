import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { DashboardService } from '../../../services';
import { NgApexchartsModule } from 'ng-apexcharts';
import { IHistoricoIndicadoresResponse } from '../../models';
import { DecimalPipe } from '@angular/common';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-card-indicador',
  imports: [
    NgApexchartsModule,
    DecimalPipe,
    Loading
],
  templateUrl: './card-indicador.html',
  styleUrl: './card-indicador.scss',
})
export class CardIndicador implements OnInit {
  @Output() opcaoIndicador = new EventEmitter<string>();

  private readonly dashboardService = inject(DashboardService);

  indicadores: IHistoricoIndicadoresResponse | null = null;

  loading = signal(false); 

  recidivaSeries: any[] = [
    { name: 'Com recidiva', data: [0] },
    { name: 'Sem recidiva', data: [0] },
  ];

  verETratarSeries: any[] = [
    { name: 'Ver e Tratar', data: [0] },
    { name: 'Outras indicações', data: [0] },
  ];

  private abrirDrawer(tipo: string) {
    return {
      dataPointSelection: (_event: any, _chart: any, options: any) => {
        if (options?.seriesIndex === 0) {
          this.opcaoIndicador.emit(tipo);
        }
      },
    };
  }

  recidivaOptions: any = {
    chart: {
      type: 'bar',
      height: 35,
      stacked: true,
      stackType: '100%',
      toolbar: { show: false },
      sparkline: { enabled: true },
      events: this.abrirDrawer('recidiva'),
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
      },
    },
    colors: ['#E79897', '#e7e5e5'],
    dataLabels: { enabled: false },
    xaxis: { categories: ['Pacientes'] },
    yaxis: { show: false },
    legend: { show: false },
    tooltip: { enabled: false },
  };

  verETratarOptions: any = {
    chart: {
      type: 'bar',
      height: 35,
      stacked: true,
      stackType: '100%',
      toolbar: { show: false },
      sparkline: { enabled: true },
      events: this.abrirDrawer('ver-e-tratar'),
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
      },
    },
    colors: ['#E79897', '#e7e5e5'],
    dataLabels: { enabled: false },
    xaxis: { categories: ['Indicações'] },
    yaxis: { show: false },
    legend: { show: false },
    tooltip: { enabled: false },
  };

  ngOnInit(): void {
    this.loading.set(true);
    
    this.dashboardService.graficoIndicadores().subscribe({
      next: (resposta) => {
        this.indicadores = resposta;
        
        this.recidivaSeries = [
          {
            name: 'Com recidiva',
            data: [resposta.percentualRecidiva],
          },
          {
            name: 'Sem recidiva',
            data: [100 - resposta.percentualRecidiva],
          },
        ];
        
        this.verETratarSeries = [
          {
            name: 'Ver e Tratar',
            data: [resposta.percentualVerETratar],
          },
          {
            name: 'Outras indicações',
            data: [100 - resposta.percentualVerETratar],
          },
        ];

        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar indicadores:', erro);
        this.loading.set(false);
      },
    });
  }
}