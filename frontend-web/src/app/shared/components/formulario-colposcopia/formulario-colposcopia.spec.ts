import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioColposcopia } from './formulario-colposcopia';

describe('FormularioColposcopia', () => {
  let component: FormularioColposcopia;
  let fixture: ComponentFixture<FormularioColposcopia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioColposcopia],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioColposcopia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
