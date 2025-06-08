import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SociosComponent } from './socios.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SociosComponent,
    RouterModule.forChild([
      { path: '', component: SociosComponent }
    ])
  ]
})
export class SociosModule { }
