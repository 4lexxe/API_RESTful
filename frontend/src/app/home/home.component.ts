import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card">
      <h1 class="title">Bienvenido al Sistema TP5</h1>
      <p>Selecciona una opción del menú para comenzar:</p>

      <div class="grid-2 mt-2">
        <div class="card">
          <h3>Gestión de Socios</h3>
          <p>Administra socios del club deportivo</p>
          <a routerLink="/socios" class="btn btn-primary">Ir a Socios</a>
        </div>

        <div class="card">
          <h3>Historial de Transacciones</h3>
          <p>LOG de traducciones realizadas</p>
          <a routerLink="/transacciones" class="btn btn-primary">Ir a Transacciones</a>
        </div>

        <div class="card">
          <h3>Gestión de Empleados</h3>
          <p>Administración del personal</p>
          <a routerLink="/empleados" class="btn btn-primary">Ir a Empleados</a>
        </div>

        <div class="card">
          <h3>Gestión de Publicaciones</h3>
          <p>Sistema de publicaciones</p>
          <a routerLink="/publicaciones" class="btn btn-primary">Ir a Publicaciones</a>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent { }
