import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-kpi',
  imports: [],
  templateUrl: './card-kpi.html',
  styleUrl: './card-kpi.scss',
})
export class CardKpi {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() kpi: number | null = null;
}
