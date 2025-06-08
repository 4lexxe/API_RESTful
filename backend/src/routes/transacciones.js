const express = require('express');
const Transaccion = require('../models/Transaccion');
const { validateTransaccion } = require('../validators/transaccionesValidator');

const router = express.Router();

//-------------------------
// POST /api/transacciones - Dar de alta una transacción (LOG)
//-------------------------
router.post('/', async (req, res) => {
  try {
    // Validar datos con Joi
    const { error, value } = validateTransaccion(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: error.details[0].message
      });
    }
    
    // Crear nueva transacción
    const nuevaTransaccion = new Transaccion(value);
    await nuevaTransaccion.save();
    
    res.status(201).json({
      message: 'Transacción registrada exitosamente',
      transaccion: nuevaTransaccion
    });
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: Object.values(error.errors)[0].message
      });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

module.exports = router;
