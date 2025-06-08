import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmpleadosComponent } from './empleados.component';

@NgModule({
  declarations: [
    EmpleadosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EmpleadosComponent }
    ])
  ]
})
export class EmpleadosModule { }
