export interface Empleado {
  _id?: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  puesto: string;  // Volver a 'puesto' según el backend
  salario: number;
  fechaIngreso: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmpleadoCreateRequest {
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  puesto: string;  // Volver a 'puesto' según el backend
  salario: number;
  fechaIngreso: string;
  activo: boolean;
}

export interface EmpleadoResponse {
  message: string;
  empleado: Empleado;
}

export interface EmpleadosListResponse {
  message: string;
  empleados: Empleado[];
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
