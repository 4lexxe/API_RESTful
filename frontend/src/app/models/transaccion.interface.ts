export interface Transaccion {
  _id?: string;
  emailCliente: string;
  textoOrigen: string;
  textoDestino: string;
  idiomaOrigen: string;
  idiomaDestino: string;
  fechaHora?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransaccionCreateRequest {
  emailCliente: string;
  textoOrigen: string;
  textoDestino: string;
  idiomaOrigen: string;
  idiomaDestino: string;
}

export interface TransaccionResponse {
  message: string;
  transaccion: Transaccion;
}

export interface TransaccionesListResponse {
  message: string;
  transacciones: Transaccion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TransaccionesClienteResponse {
  message: string;
  emailCliente: string;
  transacciones: Transaccion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiError {
  error: string;
  message: string;
}
