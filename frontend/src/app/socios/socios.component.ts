import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SociosService } from '../services/socios.service';
import { Socio, SocioCreateRequest, SocioResponse, SociosListResponse } from '../models/socio.interface';

@Component({
  selector: 'app-socios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="main-container socios-container">
      <!-- PRIMER CONTENEDOR: Formulario de creación -->
      <div class="card main-card">
        <h1 class="title">Registro de Socios</h1>
        <p>Formulario para dar de alta nuevos socios del club.</p>

        <div class="black-border-container compact">
          <h3 class="form-section-title">Agregar Nuevo Socio</h3>

          <form (ngSubmit)="crearSocio()" #socioForm="ngForm">
            <div class="grid-2">
              <div class="input-group">
                <label class="input-label">Nombre</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="nuevoSocio.nombre"
                  name="nombre"
                  required
                  minlength="2"
                  maxlength="50"
                  placeholder="Ingrese el nombre"
                  #nombre="ngModel">
                <div *ngIf="nombre.invalid && nombre.touched" class="input-error">
                  El nombre es requerido (2-50 caracteres)
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">Apellido</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="nuevoSocio.apellido"
                  name="apellido"
                  required
                  minlength="2"
                  maxlength="50"
                  placeholder="Ingrese el apellido"
                  #apellido="ngModel">
                <div *ngIf="apellido.invalid && apellido.touched" class="input-error">
                  El apellido es requerido (2-50 caracteres)
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">DNI</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="nuevoSocio.dni"
                  name="dni"
                  required
                  pattern="[0-9]{7,8}"
                  placeholder="12345678"
                  #dni="ngModel">
                <div *ngIf="dni.invalid && dni.touched" class="input-error">
                  El DNI debe tener 7 u 8 dígitos
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">Foto URL</label>
                <input
                  type="url"
                  class="form-input"
                  [(ngModel)]="nuevoSocio.foto"
                  name="foto"
                  required
                  placeholder="https://ejemplo.com/foto.jpg"
                  #foto="ngModel">
                <div *ngIf="foto.invalid && foto.touched" class="input-error">
                  La URL de la foto es requerida
                </div>
              </div>
            </div>

            <div class="checkbox-group compact">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  class="checkbox-input"
                  [(ngModel)]="nuevoSocio.activo"
                  name="activo">
                <span>Socio Activo</span>
              </label>
            </div>

            <div class="form-actions mt-1">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="socioForm.invalid || cargando">
                <i class="bi bi-person-plus-fill me-2"></i>
                {{ cargando ? 'Guardando...' : 'Guardar Socio' }}
              </button>
              <button
                type="button"
                class="btn"
                (click)="limpiarFormulario()">
                <i class="bi bi-arrow-clockwise me-2"></i>
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <!-- Mensajes de estado -->
        <div *ngIf="mensaje" class="alert alert-success">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ mensaje }}
        </div>

        <div *ngIf="error" class="alert alert-error">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
        </div>
      </div>

      <!-- SEPARACIÓN VISUAL entre contenedores -->
      <div class="container-separator"></div>

      <!-- SEGUNDO CONTENEDOR: Listado de socios separado -->
      <div class="card main-card">
        <h1 class="title">Listado de Socios</h1>
        <p>Administración y visualización de socios registrados en el sistema.</p>

        <!-- Botón de acción -->
        <div class="form-actions">
          <button
            class="btn btn-success"
            (click)="cargarSocios()"
            [disabled]="cargando">
            <i class="bi bi-arrow-repeat me-2"></i>
            {{ cargando ? 'Cargando...' : 'Actualizar Lista de Socios' }}
          </button>
        </div>

        <!-- Lista de socios con borde negro grueso - Cuadrícula -->
        <div *ngIf="socios.length > 0" class="mt-2 black-border-container compact">
          <h3 class="section-title">
            <i class="bi bi-people-fill me-2"></i>
            Total de Socios ({{ socios.length }})
          </h3>
          <div class="socios-grid">
            <div *ngFor="let socio of socios" class="socio-card compact">
              <div class="socio-header">
                <img
                  [src]="socio.foto"
                  [alt]="socio.nombre"
                  class="socio-avatar"
                  onerror="this.src='https://via.placeholder.com/60x60/cccccc/000000?text=No+Img'">
                <div class="socio-info">
                  <h4 class="socio-name">{{ socio.nombre }} {{ socio.apellido }}</h4>
                  <p class="socio-detail">
                    <i class="bi bi-person-badge me-1"></i>
                    Socio Nº {{ socio.numeroSocio }}
                  </p>
                </div>
              </div>

              <div class="socio-details">
                <div class="detail-row">
                  <span class="detail-label">
                    <i class="bi bi-card-text me-1"></i>
                    DNI:
                  </span>
                  <span class="detail-value">{{ socio.dni }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">
                    <i class="bi bi-circle-fill me-1" [class]="socio.activo ? 'text-success' : 'text-danger'"></i>
                    Estado:
                  </span>
                  <span class="status-badge" [class]="socio.activo ? 'status-active' : 'status-inactive'">
                    {{ socio.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="socio-actions">
                <button
                  class="btn btn-danger btn-sm"
                  (click)="eliminarSocio(socio._id!, socio.nombre, socio.apellido)"
                  [disabled]="cargando"
                  title="Eliminar socio">
                  <i class="bi bi-trash-fill"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div *ngIf="socios.length === 0 && !cargando" class="empty-state mt-2">
          <i class="bi bi-person-x display-1 text-muted mb-3"></i>
          <p>No hay socios registrados. Agrega el primer socio usando el formulario.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      padding-top: 1rem;
    }

    .socios-container {
      position: relative;
      z-index: 10; /* Menor que navbar pero mayor que otros componentes */
      padding-top: 0; /* Quitamos padding superior, confiamos en main-container */
      margin-top: 0; /* Ya no necesitamos este margen */
    }

    .main-card {
      background: #ffffff;
      border: 4px solid #000000;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem; /* Aumentamos la separación entre cards */
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    /* Separador entre contenedores - más espacio */
    .container-separator {
      height: 50px; /* Más alto */
      margin: 40px 0; /* Más margen */
      position: relative;
      background-color: #f0f0f0; /* Color de fondo visible */
    }

    .container-separator::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 5px;
      background-color: #000000;
      border-radius: 3px;
    }

    .black-border-container {
      border: 3px solid #000000;
      border-radius: 8px;
      padding: 1.5rem;
      background: #f9f9f9;
      margin-bottom: 1rem;
    }

    .black-border-container.compact {
      padding: 1rem;
    }

    .socios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .socio-card {
      background: #fff;
      border: 3px solid #000000;
      border-radius: 8px;
      padding: 1rem;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .socio-card.compact {
      padding: 0.75rem;
    }

    .socio-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 0.75rem;
    }

    .socio-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid #000;
      margin-bottom: 0.75rem;
      object-fit: cover;
    }

    .socio-info {
      width: 100%;
    }

    .socio-name {
      margin: 0;
      color: #000;
      font-size: 1.1rem;
      font-weight: 700;
      text-align: center;
    }

    .socio-detail {
      margin: 0.25rem 0 0 0;
      color: #666;
      font-size: 0.9rem;
      text-align: center;
    }

    .socio-details {
      border-top: 2px solid #eee;
      padding-top: 0.75rem;
      margin-top: auto;
    }

    .socio-actions {
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 2px solid #eee;
      display: flex;
      justify-content: center;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      border-radius: 4px;
    }

    .text-success {
      color: #28a745 !important;
    }

    .text-danger {
      color: #dc3545 !important;
    }

    .text-muted {
      color: #6c757d !important;
    }

    .display-1 {
      font-size: 6rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #6c757d;
    }

    .me-1 {
      margin-right: 0.25rem !important;
    }

    .me-2 {
      margin-right: 0.5rem !important;
    }

    .mb-3 {
      margin-bottom: 1rem !important;
    }

    @media (max-width: 576px) {
      .socios-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SociosComponent implements OnInit {
  nuevoSocio: SocioCreateRequest = {
    nombre: '',
    apellido: '',
    dni: '',
    foto: '',
    activo: false
  };
  socios: Socio[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  constructor(private sociosService: SociosService) {}

  ngOnInit(): void {
    this.cargarSocios();
  }

  async crearSocio(): Promise<void> {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    try {
      const respuesta: SocioResponse = await this.sociosService.crearSocio(this.nuevoSocio);

      this.mensaje = `Socio creado exitosamente: ${respuesta.socio.nombre} ${respuesta.socio.apellido} (Nº ${respuesta.socio.numeroSocio})`;
      this.limpiarFormulario();

      await this.cargarSocios();

    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.cargando = false;
    }
  }

  async cargarSocios(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      const respuesta: SociosListResponse = await this.sociosService.obtenerSocios();
      this.socios = respuesta.socios;

    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.cargando = false;
    }
  }

  async eliminarSocio(id: string, nombre: string, apellido: string): Promise<void> {
    const confirmacion = confirm(`¿Está seguro de que desea eliminar al socio ${nombre} ${apellido}?\n\nEsta acción no se puede deshacer.`);

    if (!confirmacion) {
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    try {
      const respuesta: SocioResponse = await this.sociosService.eliminarSocio(id);

      this.mensaje = `Socio eliminado exitosamente: ${nombre} ${apellido}`;

      // Recargar la lista de socios
      await this.cargarSocios();

    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.cargando = false;
    }
  }

  limpiarFormulario(): void {
    this.nuevoSocio = {
      nombre: '',
      apellido: '',
      dni: '',
      foto: '',
      activo: false
    };
    this.mensaje = '';
    this.error = '';
  }
}
