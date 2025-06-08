const express = require('express');
const cors = require('cors');
const { colorLog } = require('./utils/colors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base
app.get('/api', (req, res) => {
  res.json({
    message: 'API Backend funcionando correctamente',
    version: '1.0.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  colorLog.server(`Servidor ejecutándose en puerto ${PORT}`);
  colorLog.url(`URL: http://localhost:${PORT}/api`);
  colorLog.success('Backend iniciado correctamente');
});
