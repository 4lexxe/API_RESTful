const express = require('express');
const Empleado = require('../models/Empleado');
const { validateEmpleado } = require('../validators/empleadosValidator');

const router = express.Router();

//-------------------------
// POST /api/empleados - Dar de alta un empleado
//-------------------------
router.post('/', async (req, res) => {
  try {
    // Validar datos con Joi
    const { error, value } = validateEmpleado(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: error.details[0].message
      });
    }
    
    // Crear nuevo empleado
    const nuevoEmpleado = new Empleado(value);
    await nuevoEmpleado.save();
    
    res.status(201).json({
      message: 'Empleado creado exitosamente',
      empleado: nuevoEmpleado
    });
    
  } catch (error) {
    if (error.code === 11000) {
      // Error de duplicado
      const campo = Object.keys(error.keyPattern)[0];
      const valor = error.keyValue[campo];
      return res.status(409).json({
        error: `${campo.toUpperCase()} duplicado`,
        message: `Ya existe un empleado con el ${campo} ${valor}`
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
