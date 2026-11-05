import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardKpi } from './card-kpi';

describe('CardKpi', () => {
  let component: CardKpi;
  let fixture: ComponentFixture<CardKpi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardKpi],
    }).compileComponents();

    fixture = TestBed.createComponent(CardKpi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
