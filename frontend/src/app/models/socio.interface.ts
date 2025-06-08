export interface Socio {
  _id?: string;
  nombre: string;
  apellido: string;
  foto: string;
  dni: string;
  numeroSocio?: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocioCreateRequest {
  nombre: string;
  apellido: string;
  foto: string;
  dni: string;
  activo: boolean;
}

export interface SocioResponse {
  message: string;
  socio: Socio;
}

export interface SociosListResponse {
  message: string;
  socios: Socio[];
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
