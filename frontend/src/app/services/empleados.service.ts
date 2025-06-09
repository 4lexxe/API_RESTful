import { Injectable } from '@angular/core';
import { apiClient } from '../config/api.config';
import {
  Empleado,
  EmpleadoCreateRequest,
  EmpleadoResponse,
  EmpleadosListResponse
} from '../models/empleado.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private readonly endpoint = '/empleados';

  constructor() { }

  //-------------------------
  // CRUD COMPLETO DE EMPLEADOS
  //-------------------------

  //-------------------------
  // CREATE - POST /api/empleados - Dar de alta un empleado
  //-------------------------
  async crearEmpleado(empleado: EmpleadoCreateRequest): Promise<EmpleadoResponse> {
    try {
      const response = await apiClient.post<EmpleadoResponse>(this.endpoint, empleado);
      return response.data;
    } catch (error: any) {
      console.error('Error creando empleado:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ - GET /api/empleados - Obtener todos los empleados
  //-------------------------
  async obtenerEmpleados(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<EmpleadosListResponse> {
    try {
      const response = await apiClient.get<EmpleadosListResponse>(this.endpoint, {
        params
      });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo empleados:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ BY ID - GET /api/empleados/:id - Obtener un empleado específico
  //-------------------------
  async obtenerEmpleadoPorId(id: string): Promise<EmpleadoResponse> {
    try {
      const response = await apiClient.get<EmpleadoResponse>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo empleado por ID:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // Métodos de búsqueda específica
  //-------------------------
  async buscarEmpleados(termino: string): Promise<EmpleadosListResponse> {
    return this.obtenerEmpleados({ search: termino });
  }

  //-------------------------
  // Manejo de errores centralizado y consistente
  //-------------------------
  private handleError(error: any): Error {
    if (error.response) {
      // Error de respuesta del servidor (4xx, 5xx)
      const apiError = error.response.data;
      return new Error(apiError.message || 'Error en el servidor');
    } else if (error.request) {
      // Error de red o conexión
      return new Error('No se pudo conectar con el servidor. Verifique su conexión.');
    } else {
      // Otro tipo de error
      return new Error(error.message || 'Error desconocido');
    }
  }
}
