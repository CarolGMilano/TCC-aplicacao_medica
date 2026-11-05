import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDrawer } from './lista-drawer';

describe('ListaDrawer', () => {
  let component: ListaDrawer;
  let fixture: ComponentFixture<ListaDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
