import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/socios',
    pathMatch: 'full'
  },
  {
    path: 'socios',
    loadChildren: () => import('./socios/socios.module').then(m => m.SociosModule)
  },
  {
    path: 'empleados',
    loadChildren: () => import('./empleados/empleados.module').then(m => m.EmpleadosModule)
  },
  {
    path: 'transacciones',
    loadChildren: () => import('./transacciones/transacciones.module').then(m => m.TransaccionesModule)
  },
  {
    path: 'publicaciones',
    loadChildren: () => import('./publicaciones/publicaciones.module').then(m => m.PublicacionesModule)
  },
  {
    path: '**',
    redirectTo: '/socios'
  }
];
