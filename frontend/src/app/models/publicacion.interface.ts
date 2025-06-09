export interface Publicacion {
  _id?: string;
  titulo: string;
  contenido: string;
  imagenAsociada: string;
  fechaPublicacion: string;
  empleado: string | EmpleadoPopulado; // Puede ser ID string o objeto empleado populado
  vigente: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para empleado populado desde el backend
export interface EmpleadoPopulado {
  _id: string;
  nombre: string;
  apellido: string;
  email?: string;
  dni?: string;
  puesto?: string;
}

export interface PublicacionCreateRequest {
  titulo: string;
  contenido: string;
  imagenAsociada: string;
  fechaPublicacion: string;
  empleado: string; // ID del empleado
  vigente: boolean;
}

export interface PublicacionResponse {
  message: string;
  publicacion: Publicacion;
}

export interface PublicacionesListResponse {
  message: string;
  publicaciones: Publicacion[];
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
