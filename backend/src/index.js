require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { colorLog } = require('./utils/colors');
const connectDB = require('./config/database');
const sociosRoutes = require('./routes/socios');
const transaccionesRoutes = require('./routes/transacciones');
const empleadosRoutes = require('./routes/empleados');
const publicacionesRoutes = require('./routes/publicaciones');

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
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/publicaciones', publicacionesRoutes);

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
      },
      transacciones: {
        getAll: 'GET /api/transacciones - Recuperar todas las transacciones',
        getByEmail: 'GET /api/transacciones/cliente/:email - Histórico por cliente',
        getByIdiomas: 'GET /api/transacciones/idiomas/:origen/:destino - Buscar por idiomas',
        create: 'POST /api/transacciones - Registrar transacción de traducción'
      },
      empleados: {
        getAll: 'GET /api/empleados - Obtener todos los empleados',
        getById: 'GET /api/empleados/:id - Obtener un empleado por ID',
        create: 'POST /api/empleados - Dar de alta un empleado'
      },
      publicaciones: {
        getAll: 'GET /api/publicaciones - Recuperar todas las publicaciones',
        create: 'POST /api/publicaciones - Dar de alta una publicación',
        update: 'PUT /api/publicaciones/:id - Modificar una publicación',
        delete: 'DELETE /api/publicaciones/:id - Eliminar una publicación'
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
