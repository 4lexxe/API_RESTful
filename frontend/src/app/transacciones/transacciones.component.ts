import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaccionesService } from '../services/transacciones.service';
import {
  Transaccion,
  TransaccionCreateRequest,
  TransaccionResponse,
  TransaccionesListResponse
} from '../models/transaccion.interface';

type FiltroTipo = 'todas' | 'cliente' | 'idiomas';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css']
})
export class TransaccionesComponent implements OnInit {
  // Datos del formulario
  nuevaTransaccion: TransaccionCreateRequest = this.createEmptyTransaccion();

  // Estado de la aplicación
  transacciones: Transaccion[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  // Estado de filtrado
  filtroActivo: FiltroTipo = 'todas';
  emailBusqueda = '';
  idiomaOrigenBusqueda = '';
  idiomaDestinoBusqueda = '';

  // Lista de idiomas comunes para el select
  idiomasDisponibles = [
    'español', 'inglés', 'francés', 'alemán', 'italiano',
    'portugués', 'japonés', 'chino', 'árabe', 'ruso'
  ];

  constructor(private transaccionesService: TransaccionesService) {}

  ngOnInit(): void {
    this.cargarTransacciones();
  }

  //-------------------------
  // MÉTODOS CRUD
  //-------------------------

  async crearTransaccion(): Promise<void> {
    await this.executeWithLoading(async () => {
      const respuesta = await this.transaccionesService.crearTransaccion(this.nuevaTransaccion);
      this.mensaje = `Transacción registrada exitosamente para ${respuesta.transaccion.emailCliente}`;
      this.limpiarFormulario();
      await this.cargarTransacciones();
    });
  }

  //-------------------------
  // MÉTODOS DE CARGA Y FILTRADO
  //-------------------------

  async cargarTransacciones(): Promise<void> {
    this.filtroActivo = 'todas';
    await this.executeWithLoading(async () => {
      const respuesta = await this.transaccionesService.obtenerTransacciones();
      this.transacciones = respuesta.transacciones;
    });
  }

  async buscarPorCliente(): Promise<void> {
    if (!this.emailBusqueda.trim()) {
      this.error = 'Por favor, ingrese un email para buscar';
      return;
    }

    this.filtroActivo = 'cliente';
    await this.executeWithLoading(async () => {
      const respuesta = await this.transaccionesService.buscarPorEmail(this.emailBusqueda.trim());
      this.transacciones = respuesta.transacciones;
    });
  }

  async buscarPorIdiomas(): Promise<void> {
    if (!this.idiomaOrigenBusqueda || !this.idiomaDestinoBusqueda) {
      this.error = 'Por favor, seleccione ambos idiomas para buscar';
      return;
    }

    this.filtroActivo = 'idiomas';
    await this.executeWithLoading(async () => {
      const respuesta = await this.transaccionesService.buscarPorIdiomas(
        this.idiomaOrigenBusqueda,
        this.idiomaDestinoBusqueda
      );
      this.transacciones = respuesta.transacciones;
    });
  }

  limpiarFiltros(): void {
    this.emailBusqueda = '';
    this.idiomaOrigenBusqueda = '';
    this.idiomaDestinoBusqueda = '';
    this.cargarTransacciones();
  }

  //-------------------------
  // MÉTODOS DE UI Y UTILIDADES
  //-------------------------

  limpiarFormulario(): void {
    this.nuevaTransaccion = this.createEmptyTransaccion();
    this.clearMessages();
  }

  //-------------------------
  // MÉTODOS DE TEXTO DINÁMICO
  //-------------------------

  getSubmitButtonText(): string {
    return this.cargando ? 'Registrando...' : 'Registrar Transacción';
  }

  getLoadButtonText(tipo: FiltroTipo): string {
    const esCargandoEseTipo = this.cargando && this.filtroActivo === tipo;
    if (esCargandoEseTipo) return 'Cargando...';

    switch (tipo) {
      case 'cliente': return 'Buscar por Cliente';
      case 'idiomas': return 'Buscar por Idiomas';
      default: return 'Todas las Transacciones';
    }
  }

  getTituloListado(): string {
    switch (this.filtroActivo) {
      case 'cliente': return `Transacciones de ${this.emailBusqueda}`;
      case 'idiomas': return `Traducciones ${this.idiomaOrigenBusqueda} → ${this.idiomaDestinoBusqueda}`;
      default: return 'Total de Transacciones';
    }
  }

  getFiltroTexto(): string {
    switch (this.filtroActivo) {
      case 'cliente': return `Cliente: ${this.emailBusqueda}`;
      case 'idiomas': return `${this.idiomaOrigenBusqueda} → ${this.idiomaDestinoBusqueda}`;
      default: return 'Todas las transacciones';
    }
  }

  getMensajeVacio(): string {
    switch (this.filtroActivo) {
      case 'cliente': return `No hay transacciones registradas para ${this.emailBusqueda}`;
      case 'idiomas': return `No hay traducciones de ${this.idiomaOrigenBusqueda} a ${this.idiomaDestinoBusqueda}`;
      default: return 'No hay transacciones registradas. Registre la primera transacción usando el formulario.';
    }
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleString('es-ES');
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

  private createEmptyTransaccion(): TransaccionCreateRequest {
    return {
      emailCliente: '',
      textoOrigen: '',
      textoDestino: '',
      idiomaOrigen: '',
      idiomaDestino: ''
    };
  }

  private clearMessages(): void {
    this.mensaje = '';
    this.error = '';
  }
}
