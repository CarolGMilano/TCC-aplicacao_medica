import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RodapeTabela } from './rodape-tabela';

describe('RodapeTabela', () => {
  let component: RodapeTabela;
  let fixture: ComponentFixture<RodapeTabela>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RodapeTabela],
    }).compileComponents();

    fixture = TestBed.createComponent(RodapeTabela);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
