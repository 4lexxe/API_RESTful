import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SociosComponent } from './socios.component';

@NgModule({
  declarations: [
    SociosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SociosComponent }
    ])
  ]
})
export class SociosModule { }
