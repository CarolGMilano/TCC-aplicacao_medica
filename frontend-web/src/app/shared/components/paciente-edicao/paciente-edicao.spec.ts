import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEdicao } from './paciente-edicao';

describe('PacienteEdicao', () => {
  let component: PacienteEdicao;
  let fixture: ComponentFixture<PacienteEdicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteEdicao],
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteEdicao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
