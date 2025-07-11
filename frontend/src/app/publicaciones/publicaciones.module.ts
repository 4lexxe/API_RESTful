import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicacionesComponent } from './publicaciones.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicacionesComponent,
    RouterModule.forChild([
      { path: '', component: PublicacionesComponent }
    ])
  ]
})
export class PublicacionesModule { }
