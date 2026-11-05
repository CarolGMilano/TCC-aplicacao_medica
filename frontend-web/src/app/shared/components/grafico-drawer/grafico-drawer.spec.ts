import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoDrawer } from './grafico-drawer';

describe('GraficoDrawer', () => {
  let component: GraficoDrawer;
  let fixture: ComponentFixture<GraficoDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
