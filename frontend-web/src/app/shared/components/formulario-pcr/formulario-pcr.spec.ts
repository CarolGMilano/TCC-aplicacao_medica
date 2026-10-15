import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPcr } from './formulario-pcr';

describe('FormularioPcr', () => {
  let component: FormularioPcr;
  let fixture: ComponentFixture<FormularioPcr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPcr],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioPcr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
