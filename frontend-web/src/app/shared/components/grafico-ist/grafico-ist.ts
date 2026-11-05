import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
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
import { DashboardService } from '../../../services';
import { IGraficoISTResponse, IstLabel } from '../../models';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-grafico-ist',
  imports: [NgApexchartsModule, Loading],
  templateUrl: './grafico-ist.html',
  styleUrl: './grafico-ist.scss',
})
export class GraficoIst implements OnInit {
  @Output() opcaoIST = new EventEmitter<string>();

  private readonly dashboardService = inject(DashboardService);

  distribuicaoIST: IGraficoISTResponse[] = [];

  loading = signal(false);

  colors: string[] = ['#E79897'];
  series: ApexAxisChartSeries = [];

  chart: ApexChart = {
    height: 300,
    type: 'bar',
    toolbar: { show: false },
    events: {
      dataPointSelection: (_event, _chart, options) => {
        if (!options) return;

        const indice = options.dataPointIndex;
        const opcaoIST = this.distribuicaoIST[indice];

        if (opcaoIST) {
          this.opcaoIST.emit(opcaoIST.ist);
        }
      },
    },
  };

  legend: ApexLegend = {
    show: false,
  };

  xaxis: ApexXAxis = {
    categories: [],
    min: 0,
    max: 10,
    labels: {
      show: false,
    },
  };

  yaxis: ApexYAxis = {
    labels: {
      show: true,
      style: {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        fontWeight: 200,
        colors: '#26301F',
      },
    },
  };

  dataLabels: ApexDataLabels = {
    enabled: true,
    offsetX: 15,
    offsetY: 0,
    style: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '12px',
      fontWeight: 600,
      colors: ['#26301F'],
    },
  };

  grid: ApexGrid = {
    show: false,
  };

  plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: true,
      borderRadius: 2,
      distributed: false,
      barHeight: '30%',
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

    this.dashboardService.graficoDistribuicaoIST().subscribe({
      next: (resposta) => {
        this.distribuicaoIST = resposta;

        const maiorQuantidade = Math.max(
          ...resposta.map(item => item.quantidade),
          0
        );

        this.xaxis = {
          ...this.xaxis,
          categories: resposta.map(item =>
            IstLabel[item.ist].toUpperCase()
          ),
          min: 0,
          max: Math.max(1, Math.ceil(maiorQuantidade * 1.1)),
        };

        this.series = [
          {
            name: 'Pacientes',
            data: resposta.map(item => item.quantidade),
          },
        ];

        this.colors = ['#E79897'];

        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar distribuição de ISTs:', erro);
        this.loading.set(false);
      },
    });
  }
}