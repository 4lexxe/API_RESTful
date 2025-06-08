import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SociosService } from '../services/socios.service';
import { Socio, SocioCreateRequest, SocioResponse, SociosListResponse } from '../models/socio.interface';

type FiltroTipo = 'todos' | 'activos' | 'inactivos';

@Component({
  selector: 'app-socios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {
  // Datos del formulario
  nuevoSocio: SocioCreateRequest = this.createEmptySocio();

  // Estado de la aplicación
  socios: Socio[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  // Estado de edición
  modoEdicion = false;
  socioEditando: Socio | null = null;

  // Estado de filtrado
  filtroActivo: FiltroTipo = 'todos';

  constructor(private sociosService: SociosService) {}

  ngOnInit(): void {
    this.cargarSocios();
  }

  //-------------------------
  // MÉTODOS CRUD
  //-------------------------

  async onSubmitForm(): Promise<void> {
    if (this.modoEdicion) {
      await this.actualizarSocio();
    } else {
      await this.crearSocio();
    }
  }

  async crearSocio(): Promise<void> {
    await this.executeWithLoading(async () => {
      const respuesta = await this.sociosService.crearSocio(this.nuevoSocio);
      this.mensaje = `Socio creado exitosamente: ${respuesta.socio.nombre} ${respuesta.socio.apellido} (Nº ${respuesta.socio.numeroSocio})`;
      this.limpiarFormulario();
      await this.cargarSocios();
    });
  }

  async actualizarSocio(): Promise<void> {
    if (!this.socioEditando?._id) {
      this.error = 'Error: No se puede actualizar el socio';
      return;
    }

    await this.executeWithLoading(async () => {
      const respuesta = await this.sociosService.actualizarSocio(this.socioEditando!._id!, this.nuevoSocio);
      this.mensaje = `Socio actualizado exitosamente: ${respuesta.socio.nombre} ${respuesta.socio.apellido}`;
      this.limpiarFormulario();
      await this.recargarListaActual();
    });
  }

  async eliminarSocio(id: string, nombre: string, apellido: string): Promise<void> {
    const confirmacion = confirm(`¿Está seguro de que desea eliminar al socio ${nombre} ${apellido}?\n\nEsta acción no se puede deshacer.`);

    if (!confirmacion) return;

    await this.executeWithLoading(async () => {
      await this.sociosService.eliminarSocio(id);
      this.mensaje = `Socio eliminado exitosamente: ${nombre} ${apellido}`;
      await this.recargarListaActual();
    });
  }

  //-------------------------
  // MÉTODOS DE CARGA Y FILTRADO
  //-------------------------

  async cargarSocios(): Promise<void> {
    this.filtroActivo = 'todos';
    await this.executeWithLoading(async () => {
      const respuesta = await this.sociosService.obtenerSocios();
      this.socios = respuesta.socios;
    });
  }

  async cargarSociosActivos(): Promise<void> {
    this.filtroActivo = 'activos';
    await this.executeWithLoading(async () => {
      const respuesta = await this.sociosService.obtenerSociosActivos();
      this.socios = respuesta.socios;
    });
  }

  async cargarSociosInactivos(): Promise<void> {
    this.filtroActivo = 'inactivos';
    await this.executeWithLoading(async () => {
      const respuesta = await this.sociosService.obtenerSociosInactivos();
      this.socios = respuesta.socios;
    });
  }

  limpiarFiltro(): void {
    this.cargarSocios();
  }

  //-------------------------
  // MÉTODOS DE UI Y UTILIDADES
  //-------------------------

  editarSocio(socio: Socio): void {
    this.modoEdicion = true;
    this.socioEditando = socio;
    this.nuevoSocio = { ...socio };
    this.clearMessages();
    this.scrollToForm();
  }

  limpiarFormulario(): void {
    this.nuevoSocio = this.createEmptySocio();
    this.clearMessages();
    this.exitEditMode();
  }

  esSocioEditando(socioId?: string): boolean {
    return this.modoEdicion && this.socioEditando?._id === socioId;
  }

  //-------------------------
  // MÉTODOS DE TEXTO DINÁMICO
  //-------------------------

  getSubmitButtonText(): string {
    if (this.cargando) {
      return this.modoEdicion ? 'Actualizando...' : 'Guardando...';
    }
    return this.modoEdicion ? 'Actualizar Socio' : 'Guardar Socio';
  }

  getLoadButtonText(tipo: FiltroTipo): string {
    const esCargandoEseTipo = this.cargando && this.filtroActivo === tipo;
    if (esCargandoEseTipo) return 'Cargando...';

    switch (tipo) {
      case 'activos': return 'Solo Activos';
      case 'inactivos': return 'Solo Inactivos';
      default: return 'Todos los Socios';
    }
  }

  getTituloListado(): string {
    switch (this.filtroActivo) {
      case 'activos': return 'Socios Activos';
      case 'inactivos': return 'Socios Inactivos';
      default: return 'Total de Socios';
    }
  }

  getFiltroTexto(): string {
    return this.filtroActivo === 'activos' ? 'Socios Activos' : 'Socios Inactivos';
  }

  getMensajeVacio(): string {
    switch (this.filtroActivo) {
      case 'activos': return 'No hay socios activos registrados.';
      case 'inactivos': return 'No hay socios inactivos registrados.';
      default: return 'No hay socios registrados. Agrega el primer socio usando el formulario.';
    }
  }

  //-------------------------
  // MÉTODOS PRIVADOS DE UTILIDAD
  //-------------------------

  private async executeWithLoading(action: () => Promise<void>): Promise<void> {
    this.cargando = true;
    this.clearMessages();

    try {
      await action();
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.cargando = false;
    }
  }

  private async recargarListaActual(): Promise<void> {
    switch (this.filtroActivo) {
      case 'activos':
        await this.cargarSociosActivos();
        break;
      case 'inactivos':
        await this.cargarSociosInactivos();
        break;
      default:
        await this.cargarSocios();
    }
  }

  private createEmptySocio(): SocioCreateRequest {
    return {
      nombre: '',
      apellido: '',
      dni: '',
      foto: '',
      activo: false
    };
  }

  private clearMessages(): void {
    this.mensaje = '';
    this.error = '';
  }

  private exitEditMode(): void {
    this.modoEdicion = false;
    this.socioEditando = null;
  }

  private scrollToForm(): void {
    document.querySelector('.main-card')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
