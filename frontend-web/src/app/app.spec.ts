import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('deve criar o componente principal', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve disponibilizar o ponto de saída do roteamento', () => {
    const fixture = TestBed.createComponent(App);

    expect(
      fixture.debugElement.query((element) => element.injector.get(RouterOutlet, null) !== null),
    ).not.toBeNull();
  });
});
