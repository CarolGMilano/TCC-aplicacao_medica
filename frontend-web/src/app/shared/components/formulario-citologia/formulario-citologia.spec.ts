import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCitologia } from './formulario-citologia';

describe('FormularioCitologia', () => {
  let component: FormularioCitologia;
  let fixture: ComponentFixture<FormularioCitologia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioCitologia],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioCitologia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
