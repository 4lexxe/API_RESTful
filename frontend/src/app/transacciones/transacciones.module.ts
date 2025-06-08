import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransaccionesComponent } from './transacciones.component';

@NgModule({
  declarations: [
    TransaccionesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TransaccionesComponent }
    ])
  ]
})
export class TransaccionesModule { }
