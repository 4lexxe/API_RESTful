import { Component } from '@angular/core';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  template: `
    <div class="card">
      <h1 class="title">Gestión de Publicaciones</h1>
      <p>Sistema de publicaciones con empleados asociados.</p>

      <div class="flex mt-2">
        <button class="btn btn-primary">Nueva Publicación</button>
        <button class="btn btn-success">Ver Publicaciones</button>
        <button class="btn btn-danger">Buscar</button>
      </div>
    </div>
  `
})
export class PublicacionesComponent { }
