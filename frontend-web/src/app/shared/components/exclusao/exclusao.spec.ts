import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exclusao } from './exclusao';

describe('Exclusao', () => {
  let component: Exclusao;
  let fixture: ComponentFixture<Exclusao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exclusao],
    }).compileComponents();

    fixture = TestBed.createComponent(Exclusao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
