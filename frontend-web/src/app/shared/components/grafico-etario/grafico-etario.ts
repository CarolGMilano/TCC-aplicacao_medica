import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { IGraficoEtarioResponse } from '../../models';
import { DashboardService } from '../../../services';

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTooltip,
  ApexGrid,
  ApexLegend
} from 'ng-apexcharts';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-grafico-etario',
  imports: [
    NgApexchartsModule,
    Loading
],
  templateUrl: './grafico-etario.html',
  styleUrl: './grafico-etario.scss',
})
export class GraficoEtario implements OnInit {
  @Output() faixaEtariaSelecionada = new EventEmitter<string>();

  private readonly dashboardService = inject(DashboardService);

  distribuicaoEtaria: IGraficoEtarioResponse[] = [];

  colors: string[] = [];
  series: ApexAxisChartSeries = [];

  loading = signal(false);
  
  chart: ApexChart = {
    height: 300,
    type: 'bar',
    toolbar: { show: false },
    events: {
      dataPointSelection: (_event, _chart, options) => {
        if (!options) return;

        const indice = options.dataPointIndex;
        const pacienteFaixa = this.distribuicaoEtaria[indice];

        if (pacienteFaixa) {
          this.faixaEtariaSelecionada.emit(pacienteFaixa.faixa);
        }
      },
    },
  };

  legend: ApexLegend = {
    show: false,
  };

  xaxis: ApexXAxis = {
    categories: [],
    position: 'bottom',
    labels: {
      style: {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        fontWeight: 200,
        colors: '#26301F',
      },
    },
  };

  yaxis: ApexYAxis = {
    min: 0,
    max: (max) => max * 1.2,
    forceNiceScale: true,
    labels: {
      show: false,
    },
  };

  dataLabels: ApexDataLabels = {
    enabled: true,
    offsetY: -30,
    style: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '12px',
      fontWeight: 600,
      colors: ['#26301F'],
    },
  };

  grid: ApexGrid = {
    show: false
  };
  
  plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      borderRadius: 4,
      distributed: true,
      columnWidth: '90%',
      dataLabels: {
        position: 'top',
      },
    },
  };
  
  tooltip: ApexTooltip = {
    enabled: false,
  };
  
  ngOnInit(): void {
    this.loading.set(true);

    this.dashboardService.graficoDistribuicaoEtaria().subscribe({
      next: (resposta) => {
        this.distribuicaoEtaria = resposta;

        this.xaxis = {
          ...this.xaxis,
          categories: resposta.map((item) => item.faixa),
        };

        this.series = [
          {
            name: 'Pacientes',
            data: resposta.map((item) => item.quantidade),
          },
        ];

        this.colors = resposta.map(item =>
          item.prioritario ? '#E79897' : '#e7e5e5'
        );

        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar distribuição etária:', erro);
        this.loading.set(false);
      },
    });
  }
}