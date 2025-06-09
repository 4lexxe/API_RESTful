import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadosService } from '../services/empleados.service';
import {
  Empleado,
  EmpleadoCreateRequest,
  EmpleadoResponse,
  EmpleadosListResponse
} from '../models/empleado.interface';

type FiltroTipo = 'todos' | 'busqueda';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  // Datos del formulario
  nuevoEmpleado: EmpleadoCreateRequest = this.createEmptyEmpleado();

  // Estado de la aplicación
  empleados: Empleado[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  // Estado de filtrado y búsqueda
  filtroActivo: FiltroTipo = 'todos';
  terminoBusqueda = '';

  // Empleado seleccionado para ver detalles
  empleadoSeleccionado: Empleado | null = null;
  mostrandoDetalle = false;

  // Lista de puestos comunes para el select
  puestosDisponibles = [
    'Desarrollador', 'Analista', 'Gerente', 'Coordinador', 'Consultor',
    'Arquitecto', 'Especialista', 'Supervisor', 'Director', 'Asistente'
  ];

  constructor(private empleadosService: EmpleadosService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  //-------------------------
  // MÉTODOS CRUD
  //-------------------------

  async crearEmpleado(): Promise<void> {
    await this.executeWithLoading(async () => {
      const respuesta = await this.empleadosService.crearEmpleado(this.nuevoEmpleado);
      this.mensaje = `Empleado creado exitosamente: ${respuesta.empleado.nombre} ${respuesta.empleado.apellido}`;
      this.limpiarFormulario();
      await this.cargarEmpleados();
    });
  }

  async verDetalleEmpleado(id: string): Promise<void> {
    await this.executeWithLoading(async () => {
      const respuesta = await this.empleadosService.obtenerEmpleadoPorId(id);
      this.empleadoSeleccionado = respuesta.empleado;
      this.mostrandoDetalle = true;
    });
  }

  //-------------------------
  // MÉTODOS DE CARGA Y FILTRADO
  //-------------------------

  async cargarEmpleados(): Promise<void> {
    this.filtroActivo = 'todos';
    await this.executeWithLoading(async () => {
      const respuesta = await this.empleadosService.obtenerEmpleados();
      this.empleados = respuesta.empleados;
    });
  }

  async buscarEmpleados(): Promise<void> {
    if (!this.terminoBusqueda.trim()) {
      this.error = 'Por favor, ingrese un término de búsqueda';
      return;
    }

    this.filtroActivo = 'busqueda';
    await this.executeWithLoading(async () => {
      const respuesta = await this.empleadosService.buscarEmpleados(this.terminoBusqueda.trim());
      this.empleados = respuesta.empleados;
    });
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.cargarEmpleados();
  }

  //-------------------------
  // MÉTODOS DE UI Y UTILIDADES
  //-------------------------

  limpiarFormulario(): void {
    this.nuevoEmpleado = this.createEmptyEmpleado();
    this.clearMessages();
  }

  cerrarDetalle(): void {
    this.empleadoSeleccionado = null;
    this.mostrandoDetalle = false;
  }

  //-------------------------
  // MÉTODOS DE TEXTO DINÁMICO
  //-------------------------

  getSubmitButtonText(): string {
    return this.cargando ? 'Registrando...' : 'Registrar Empleado';
  }

  getLoadButtonText(tipo: FiltroTipo): string {
    const esCargandoEseTipo = this.cargando && this.filtroActivo === tipo;
    if (esCargandoEseTipo) return 'Cargando...';

    switch (tipo) {
      case 'busqueda': return 'Buscar';
      default: return 'Todos los Empleados';
    }
  }

  getTituloListado(): string {
    switch (this.filtroActivo) {
      case 'busqueda': return `Resultados para "${this.terminoBusqueda}"`;
      default: return 'Total de Empleados';
    }
  }

  getFiltroTexto(): string {
    return `Búsqueda: ${this.terminoBusqueda}`;
  }

  getMensajeVacio(): string {
    switch (this.filtroActivo) {
      case 'busqueda': return `No se encontraron empleados que coincidan con "${this.terminoBusqueda}"`;
      default: return 'No hay empleados registrados. Registre el primer empleado usando el formulario.';
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  formatearSalario(salario: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(salario);
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

  private createEmptyEmpleado(): EmpleadoCreateRequest {
    return {
      nombre: '',
      apellido: '',
      email: '',
      dni: '',
      puesto: '',
      salario: 0,
      fechaIngreso: '',
      activo: true
    };
  }

  private clearMessages(): void {
    this.mensaje = '';
    this.error = '';
  }
}
