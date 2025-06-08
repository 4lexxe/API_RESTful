const express = require('express');
const Socio = require('../models/Socio');
const { validateSocio } = require('../validators/sociosValidator');

const router = express.Router();

//-------------------------
// POST /api/socios - Dar de alta un socio
//-------------------------
router.post('/', async (req, res) => {
  try {
    // Validar datos con Joi
    const { error, value } = validateSocio(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: error.details[0].message
      });
    }
    
    // Crear nuevo socio
    const nuevoSocio = new Socio(value);
    await nuevoSocio.save();
    
    res.status(201).json({
      message: 'Socio creado exitosamente',
      socio: nuevoSocio
    });
    
  } catch (error) {
    if (error.code === 11000) {
      // Error de duplicado (DNI ya existe)
      return res.status(409).json({
        error: 'DNI duplicado',
        message: `Ya existe un socio con el DNI ${req.body.dni}`
      });
    }
    
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
