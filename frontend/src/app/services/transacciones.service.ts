import { Injectable } from '@angular/core';
import { apiClient } from '../config/api.config';
import {
  Transaccion,
  TransaccionCreateRequest,
  TransaccionResponse,
  TransaccionesListResponse
} from '../models/transaccion.interface';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private readonly endpoint = '/transacciones';

  constructor() { }

  //-------------------------
  // CRUD COMPLETO DE TRANSACCIONES
  //-------------------------

  //-------------------------
  // CREATE - POST /api/transacciones - Registrar nueva transacción
  //-------------------------
  async crearTransaccion(transaccion: TransaccionCreateRequest): Promise<TransaccionResponse> {
    try {
      const response = await apiClient.post<TransaccionResponse>(this.endpoint, transaccion);
      return response.data;
    } catch (error: any) {
      console.error('Error creando transacción:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ - GET /api/transacciones - Obtener todas las transacciones
  //-------------------------
  async obtenerTransacciones(params?: {
    emailCliente?: string;
    idiomaOrigen?: string;
    idiomaDestino?: string;
    page?: number;
    limit?: number;
  }): Promise<TransaccionesListResponse> {
    try {
      const response = await apiClient.get<TransaccionesListResponse>(this.endpoint, {
        params
      });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo transacciones:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // Métodos de búsqueda específica
  //-------------------------
  async buscarPorEmail(email: string): Promise<TransaccionesListResponse> {
    try {
      const response = await apiClient.get<TransaccionesListResponse>(`${this.endpoint}/cliente/${email}`);
      return response.data;
    } catch (error: any) {
      console.error('Error buscando por email:', error);
      throw this.handleError(error);
    }
  }

  async buscarPorIdiomas(origen: string, destino: string): Promise<TransaccionesListResponse> {
    try {
      const response = await apiClient.get<TransaccionesListResponse>(`${this.endpoint}/idiomas/${origen}/${destino}`);
      return response.data;
    } catch (error: any) {
      console.error('Error buscando por idiomas:', error);
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
