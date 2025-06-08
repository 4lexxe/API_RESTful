import { Component } from '@angular/core';

@Component({
  selector: 'app-socios',
  standalone: true,
  template: `
    <div class="card">
      <h1 class="title">Gestión de Socios</h1>
      <p>Panel de administración de socios del club.</p>

      <div class="flex mt-2">
        <button class="btn btn-primary">Agregar Socio</button>
        <button class="btn btn-success">Ver Todos</button>
      </div>
    </div>
  `
})
export class SociosComponent { }
