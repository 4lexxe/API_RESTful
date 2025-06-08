import { Injectable } from '@angular/core';
import { apiClient } from '../config/api.config';
import {
  Transaccion,
  TransaccionCreateRequest,
  TransaccionResponse,
  TransaccionesListResponse,
  TransaccionesClienteResponse
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
  // READ BY CLIENT - GET /api/transacciones/cliente/:email - Histórico por cliente
  //-------------------------
  async obtenerTransaccionesPorCliente(
    email: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<TransaccionesClienteResponse> {
    try {
      const response = await apiClient.get<TransaccionesClienteResponse>(
        `${this.endpoint}/cliente/${email}`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo transacciones por cliente:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // READ BY LANGUAGES - GET /api/transacciones/idiomas/:origen/:destino - Por idiomas
  //-------------------------
  async obtenerTransaccionesPorIdiomas(
    idiomaOrigen: string,
    idiomaDestino: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<TransaccionesListResponse> {
    try {
      const response = await apiClient.get<TransaccionesListResponse>(
        `${this.endpoint}/idiomas/${idiomaOrigen}/${idiomaDestino}`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo transacciones por idiomas:', error);
      throw this.handleError(error);
    }
  }

  //-------------------------
  // Métodos de utilidad para filtrado
  //-------------------------
  async buscarPorEmail(email: string): Promise<TransaccionesClienteResponse> {
    return this.obtenerTransaccionesPorCliente(email);
  }

  async buscarPorIdiomas(origen: string, destino: string): Promise<TransaccionesListResponse> {
    return this.obtenerTransaccionesPorIdiomas(origen, destino);
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
