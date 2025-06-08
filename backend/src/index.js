require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { colorLog } = require('./utils/colors');
const connectDB = require('./config/database');
const sociosRoutes = require('./routes/socios');

const app = express();
const PORT = process.env.PORT || 3000;

//-------------------------
// Conectar a MongoDB
//-------------------------
connectDB();

//-------------------------
// Middleware básico
//-------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-------------------------
// Rutas
//-------------------------
app.use('/api/socios', sociosRoutes);

//-------------------------
// Ruta base
//-------------------------
app.get('/api', (req, res) => {
  res.json({
    message: 'API Backend funcionando correctamente',
    version: '1.0.0',
    database: 'MongoDB',
    endpoints: {
      health: 'GET /api/health',
      socios: {
        getAll: 'GET /api/socios - Recuperar todos los socios',
        create: 'POST /api/socios - Dar de alta un socio',
        update: 'PUT /api/socios/:id - Modificar un socio',
        delete: 'DELETE /api/socios/:id - Eliminar un socio'
      }
    }
  });
});

//-------------------------
// Health check
//-------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'MongoDB conectado'
  });
});

//-------------------------
// Iniciar servidor
//-------------------------
app.listen(PORT, () => {
  colorLog.server(`Servidor ejecutándose en puerto ${PORT}`);
  colorLog.url(`URL: http://localhost:${PORT}/api`);
  colorLog.success('Backend iniciado correctamente');
});
