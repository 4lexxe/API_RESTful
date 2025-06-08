import axios, { AxiosInstance } from 'axios';

// Configuración base de la API
export const API_CONFIG = {
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Crear instancia de Axios configurada
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Interceptores para manejo de requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptores para manejo de responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ [API Response Error]', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);
