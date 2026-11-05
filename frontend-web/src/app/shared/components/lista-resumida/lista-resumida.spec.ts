import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaResumida } from './lista-resumida';

describe('ListaResumida', () => {
  let component: ListaResumida;
  let fixture: ComponentFixture<ListaResumida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaResumida],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaResumida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
