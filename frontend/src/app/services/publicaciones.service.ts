import { Injectable } from '@angular/core';
import { apiClient } from '../config/api.config';
import {
  Publicacion,
  PublicacionCreateRequest,
  PublicacionResponse,
  PublicacionesListResponse
} from '../models/publicacion.interface';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private readonly endpoint = '/publicaciones';

  constructor() { }

  //-------------------------
  // CRUD COMPLETO DE PUBLICACIONES
  //-------------------------

  //-------------------------
  // CREATE - POST /api/publicaciones - Dar de alta una publicación
  //-------------------------
  async crearPublicacion(publicacion: PublicacionCreateRequest): Promise<PublicacionResponse> {
    try {
      const response = await apiClient.post<PublicacionResponse>(this.endpoint, publicacion);
      return response.data;
    } catch (error: any) {
      console.error('Error creando publicación:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ - GET /api/publicaciones - Obtener todas las publicaciones
  //-------------------------
  async obtenerPublicaciones(params?: {
    empleado?: string;
    vigente?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PublicacionesListResponse> {
    try {
      const response = await apiClient.get<PublicacionesListResponse>(this.endpoint, {
        params
      });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo publicaciones:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ BY ID - GET /api/publicaciones/:id - Obtener una publicación específica
  //-------------------------
  async obtenerPublicacionPorId(id: string): Promise<PublicacionResponse> {
    try {
      const response = await apiClient.get<PublicacionResponse>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo publicación por ID:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // Métodos de filtrado específico
  //-------------------------
  async obtenerPublicacionesVigentes(): Promise<PublicacionesListResponse> {
    return this.obtenerPublicaciones({ vigente: true });
  }

  async obtenerPublicacionesPorEmpleado(empleadoId: string): Promise<PublicacionesListResponse> {
    return this.obtenerPublicaciones({ empleado: empleadoId });
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
