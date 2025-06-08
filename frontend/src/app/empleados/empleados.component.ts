import { Component } from '@angular/core';

@Component({
  selector: 'app-empleados',
  standalone: true,
  template: `
    <div class="card">
      <h1 class="title">Gestión de Empleados</h1>
      <p>Administración del personal de la empresa.</p>

      <div class="flex mt-2">
        <button class="btn btn-primary">Agregar Empleado</button>
        <button class="btn btn-success">Ver Lista</button>
      </div>
    </div>
  `
})
export class EmpleadosComponent { }
