import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProcedimento } from './formulario-procedimento';

describe('FormularioProcedimento', () => {
  let component: FormularioProcedimento;
  let fixture: ComponentFixture<FormularioProcedimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioProcedimento],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioProcedimento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
