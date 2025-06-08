import { Injectable } from '@angular/core';
import { apiClient } from '../config/api.config';
import {
  Socio,
  SocioCreateRequest,
  SocioResponse,
  SociosListResponse
} from '../models/socio.interface';

@Injectable({
  providedIn: 'root'
})
export class SociosService {

  private readonly endpoint = '/socios';

  constructor() { }

  //-------------------------
  // CRUD COMPLETO DE SOCIOS
  //-------------------------

  //-------------------------
  // CREATE - POST /api/socios - Dar de alta un socio
  //-------------------------
  async crearSocio(socio: SocioCreateRequest): Promise<SocioResponse> {
    try {
      const response = await apiClient.post<SocioResponse>(this.endpoint, socio);
      return response.data;
    } catch (error: any) {
      console.error('Error creando socio:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ - GET /api/socios - Obtener todos los socios
  //-------------------------
  async obtenerSocios(params?: {
    activo?: boolean;
    page?: number;
    limit?: number;
  }): Promise<SociosListResponse> {
    try {
      const response = await apiClient.get<SociosListResponse>(this.endpoint, {
        params
      });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo socios:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ ACTIVOS - GET /api/socios?activo=true - Obtener solo socios activos
  //-------------------------
  async obtenerSociosActivos(): Promise<SociosListResponse> {
    try {
      const response = await apiClient.get<SociosListResponse>(this.endpoint, {
        params: { activo: true }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo socios activos:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ INACTIVOS - GET /api/socios?activo=false - Obtener solo socios inactivos
  //-------------------------
  async obtenerSociosInactivos(): Promise<SociosListResponse> {
    try {
      const response = await apiClient.get<SociosListResponse>(this.endpoint, {
        params: { activo: false }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo socios inactivos:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // UPDATE - PUT /api/socios/:id - Actualizar socio
  //-------------------------
  async actualizarSocio(id: string, socio: SocioCreateRequest): Promise<SocioResponse> {
    try {
      const response = await apiClient.put<SocioResponse>(`${this.endpoint}/${id}`, socio);
      return response.data;
    } catch (error: any) {
      console.error('Error actualizando socio:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // DELETE - DELETE /api/socios/:id - Eliminar socio
  //-------------------------
  async eliminarSocio(id: string): Promise<SocioResponse> {
    try {
      const response = await apiClient.delete<SocioResponse>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error eliminando socio:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // GET BY ID - GET /api/socios/:id - Obtener un socio específico (opcional)
  //-------------------------
  async obtenerSocioPorId(id: string): Promise<SocioResponse> {
    try {
      const response = await apiClient.get<SocioResponse>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo socio por ID:', error);
      throw this.handleError(error);
    }
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
