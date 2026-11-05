import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoEtario } from './grafico-etario';

describe('GraficoEtario', () => {
  let component: GraficoEtario;
  let fixture: ComponentFixture<GraficoEtario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoEtario],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoEtario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
