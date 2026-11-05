import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIndicador } from './card-indicador';

describe('CardIndicador', () => {
  let component: CardIndicador;
  let fixture: ComponentFixture<CardIndicador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardIndicador],
    }).compileComponents();

    fixture = TestBed.createComponent(CardIndicador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
