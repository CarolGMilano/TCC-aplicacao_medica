import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoIst } from './grafico-ist';

describe('GraficoIst', () => {
  let component: GraficoIst;
  let fixture: ComponentFixture<GraficoIst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoIst],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoIst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
