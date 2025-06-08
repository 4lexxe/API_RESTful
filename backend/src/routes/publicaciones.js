const express = require('express');
const Publicacion = require('../models/Publicacion');
const Empleado = require('../models/Empleado');
const { validatePublicacion } = require('../validators/publicacionesValidator');

const router = express.Router();

//-------------------------
// POST /api/publicaciones - Dar de alta una publicación
//-------------------------
router.post('/', async (req, res) => {
  try {
    // Validar datos con Joi
    const { error, value } = validatePublicacion(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: error.details[0].message
      });
    }
    
    // Verificar que el empleado existe
    const empleadoExiste = await Empleado.findById(value.empleado);
    if (!empleadoExiste) {
      return res.status(404).json({
        error: 'Empleado no encontrado',
        message: `No existe un empleado con el ID ${value.empleado}`
      });
    }
    
    // Crear nueva publicación
    const nuevaPublicacion = new Publicacion(value);
    await nuevaPublicacion.save();
    
    // Populate para incluir datos del empleado en la respuesta
    await nuevaPublicacion.populate('empleado', 'nombre apellido email');
    
    res.status(201).json({
      message: 'Publicación creada exitosamente',
      publicacion: nuevaPublicacion
    });
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: Object.values(error.errors)[0].message
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'ID de empleado inválido',
        message: 'El ID del empleado proporcionado no es válido'
      });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

module.exports = router;
