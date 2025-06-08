import { Component } from '@angular/core';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  template: `
    <div class="card">
      <h1 class="title">Historial de Transacciones</h1>
      <p>LOG de traducciones realizadas en el sistema.</p>

      <div class="flex mt-2">
        <button class="btn btn-primary">Nueva Transacción</button>
        <button class="btn btn-success">Ver Historial</button>
      </div>
    </div>
  `
})
export class TransaccionesComponent { }
