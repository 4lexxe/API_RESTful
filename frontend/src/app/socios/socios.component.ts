import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SociosService } from '../services/socios.service';
import { Socio, SocioCreateRequest } from '../models/socio.interface';

@Component({
  selector: 'app-socios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h1 class="title">Gestión de Socios</h1>
      <p>Panel de administración de socios del club.</p>

      <!-- Formulario para crear socio -->
      <div class="card mt-2">
        <h3>Agregar Nuevo Socio</h3>

        <form (ngSubmit)="crearSocio()" #socioForm="ngForm">
          <div class="grid-2">
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="nuevoSocio.nombre"
                name="nombre"
                required
                minlength="2"
                maxlength="50"
                #nombre="ngModel">
              <div *ngIf="nombre.invalid && nombre.touched" class="error">
                El nombre es requerido (2-50 caracteres)
              </div>
            </div>

            <div>
              <label>Apellido:</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="nuevoSocio.apellido"
                name="apellido"
                required
                minlength="2"
                maxlength="50"
                #apellido="ngModel">
              <div *ngIf="apellido.invalid && apellido.touched" class="error">
                El apellido es requerido (2-50 caracteres)
              </div>
            </div>

            <div>
              <label>DNI:</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="nuevoSocio.dni"
                name="dni"
                required
                pattern="[0-9]{7,8}"
                #dni="ngModel">
              <div *ngIf="dni.invalid && dni.touched" class="error">
                El DNI debe tener 7 u 8 dígitos
              </div>
            </div>

            <div>
              <label>Foto (URL):</label>
              <input
                type="url"
                class="form-input"
                [(ngModel)]="nuevoSocio.foto"
                name="foto"
                required
                #foto="ngModel">
              <div *ngIf="foto.invalid && foto.touched" class="error">
                La URL de la foto es requerida
              </div>
            </div>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                [(ngModel)]="nuevoSocio.activo"
                name="activo">
              Socio Activo
            </label>
          </div>

          <div class="flex mt-2">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="socioForm.invalid || cargando">
              {{ cargando ? 'Guardando...' : 'Guardar Socio' }}
            </button>
            <button
              type="button"
              class="btn"
              (click)="limpiarFormulario()">
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <!-- Mensajes de estado -->
      <div *ngIf="mensaje" class="success mt-2">
        {{ mensaje }}
      </div>

      <div *ngIf="error" class="error mt-2">
        {{ error }}
      </div>

      <!-- Lista de socios -->
      <div class="flex mt-2">
        <button class="btn btn-success" (click)="cargarSocios()">
          {{ cargando ? 'Cargando...' : 'Ver Todos los Socios' }}
        </button>
      </div>

      <div *ngIf="socios.length > 0" class="mt-2">
        <h3>Lista de Socios ({{ socios.length }})</h3>
        <div class="grid-2">
          <div *ngFor="let socio of socios" class="card">
            <h4>{{ socio.nombre }} {{ socio.apellido }}</h4>
            <p><strong>DNI:</strong> {{ socio.dni }}</p>
            <p><strong>Número:</strong> {{ socio.numeroSocio }}</p>
            <p><strong>Estado:</strong>
              <span [class]="socio.activo ? 'success' : 'error'">
                {{ socio.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </p>
            <img [src]="socio.foto" [alt]="socio.nombre" style="width: 60px; height: 60px; border-radius: 50%;">
          </div>
        </div>
      </div>
    </div>
  `
})
export class SociosComponent implements OnInit {

  socios: Socio[] = [];
  cargando: boolean = false;
  mensaje: string = '';
  error: string = '';

  nuevoSocio: SocioCreateRequest = {
    nombre: '',
    apellido: '',
    foto: '',
    dni: '',
    activo: true
  };

  constructor(private sociosService: SociosService) { }

  ngOnInit(): void {
    this.cargarSocios();
  }

  //-------------------------
  // Crear nuevo socio
  //-------------------------
  async crearSocio(): Promise<void> {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    try {
      const respuesta = await this.sociosService.crearSocio(this.nuevoSocio);

      this.mensaje = `Socio creado exitosamente: ${respuesta.socio.nombre} ${respuesta.socio.apellido} (Nº ${respuesta.socio.numeroSocio})`;
      this.limpiarFormulario();

      // Recargar lista
      await this.cargarSocios();

    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.cargando = false;
    }
  }

  //-------------------------
  // Cargar todos los socios
  //-------------------------
  async cargarSocios(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      const respuesta = await this.sociosService.obtenerSocios();
      this.socios = respuesta.socios;

    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.cargando = false;
    }
  }

  //-------------------------
  // Limpiar formulario
  //-------------------------
  limpiarFormulario(): void {
    this.nuevoSocio = {
      nombre: '',
      apellido: '',
      foto: '',
      dni: '',
      activo: true
    };
    this.mensaje = '';
    this.error = '';
  }
}
