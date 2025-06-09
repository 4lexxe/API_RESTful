const express = require('express');
const router = express.Router();

// Ruta de ejemplo
router.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Importar y usar rutas de usuarios
const userRoutes = require('./users');
router.use('/users', userRoutes);

module.exports = router;
