# Proyecto Backend-Frontend

Este proyecto contiene tanto el frontend (Angular) como el backend (Node.js/Express) para el TP5.

## Estructura del Proyecto

```
backend-frontend/
├── frontend/          # Aplicación Angular
├── backend/           # API Node.js/Express
└── README.md         # Este archivo
```

## Backend API

### Requisitos
- Node.js v18 o superior
- npm v8 o superior

### Instalación
```bash
cd backend
npm install
```

### Desarrollo
```bash
# Modo desarrollo con nodemon
npm run dev

# Modo producción
npm start
```

### Endpoints Disponibles
- `GET /api` - Información general de la API
- `GET /api/health` - Estado del servidor
- `GET /api/servicios` - Lista de servicios disponibles

### Testing
Utilizar **Postman** para probar los endpoints:
1. Importar colección de endpoints
2. Configurar environment con `baseUrl: http://localhost:3000`
3. Ejecutar tests en los endpoints disponibles

## Frontend Angular

### Desarrollo
```bash
cd frontend
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

## URLs por Defecto
- **Backend API**: http://localhost:3000/api
- **Frontend**: http://localhost:4200/
