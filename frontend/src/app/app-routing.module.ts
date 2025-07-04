import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'socios',
    loadComponent: () => import('./socios/socios.component').then(m => m.SociosComponent)
  },
  {
    path: 'transacciones',
    loadComponent: () => import('./transacciones/transacciones.component').then(m => m.TransaccionesComponent)
  },
  {
    path: 'empleados',
    loadComponent: () => import('./empleados/empleados.component').then(m => m.EmpleadosComponent)
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./publicaciones/publicaciones.component').then(m => m.PublicacionesComponent)
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
