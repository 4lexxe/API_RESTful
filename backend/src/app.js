const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

// Middleware para CORS (debe ir ANTES de las rutas)
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware para logging
app.use(morgan('dev'));

// Middleware para parsear JSON con límite MUY ALTO para imágenes base64
app.use(express.json({ 
  limit: '100mb',  // Aumentar a 100mb para asegurar que funcione
  extended: true,
  parameterLimit: 100000
}));

app.use(express.urlencoded({ 
  limit: '100mb',  // Aumentar a 100mb para datos de formulario
  extended: true,
  parameterLimit: 100000
}));

// Rutas de la aplicación
app.use('/api', routes);

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Error de payload demasiado grande
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload demasiado grande',
      message: 'El archivo o datos enviados son demasiado grandes'
    });
  }
  
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Algo salió mal en el servidor'
  });
});

module.exports = app;