import { NgModule } from '@angular/core';
import { Numeros } from './directives';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    Numeros
  ],
  exports: [
    Numeros
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {}
