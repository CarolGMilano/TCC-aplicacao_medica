import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoBusca } from './campo-busca';

describe('CampoBusca', () => {
  let component: CampoBusca;
  let fixture: ComponentFixture<CampoBusca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoBusca],
    }).compileComponents();

    fixture = TestBed.createComponent(CampoBusca);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
