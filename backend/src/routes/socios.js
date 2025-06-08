const express = require('express');
const Socio = require('../models/Socio');
const { validateSocio } = require('../validators/sociosValidator');

const router = express.Router();

//-------------------------
// GET /api/socios - Recuperar TODOS los socios
//-------------------------
router.get('/', async (req, res) => {
  try {
    const { activo, page = 1, limit = 10 } = req.query;
    
    // Crear filtro opcional por estado activo
    const filter = {};
    if (activo !== undefined) {
      filter.activo = activo === 'true';
    }
    
    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Buscar socios con filtros y paginación
    const socios = await Socio.find(filter)
      .sort({ numeroSocio: 1 })
      .skip(skip)
      .limit(limitNum);
    
    // Contar total para paginación
    const total = await Socio.countDocuments(filter);
    
    res.json({
      message: 'Socios recuperados exitosamente',
      socios,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

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
