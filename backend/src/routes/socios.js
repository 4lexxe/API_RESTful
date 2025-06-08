const express = require('express');
const Socio = require('../models/Socio');
const { validateSocio, validateUpdateSocio } = require('../validators/sociosValidator');

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

//-------------------------
// PUT /api/socios/:id - Modificar un socio completo
//-------------------------
router.put('/:id', async (req, res) => {
  try {
    // Validar datos
    const { error, value } = validateUpdateSocio(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: error.details[0].message
      });
    }
    
    // Buscar el socio
    const socio = await Socio.findById(req.params.id);
    
    if (!socio) {
      return res.status(404).json({
        error: 'Socio no encontrado',
        message: `No existe un socio con el ID ${req.params.id}`
      });
    }
    
    // Verificar que el DNI no exista en otro socio
    if (value.dni !== socio.dni) {
      const socioConMismoDni = await Socio.findOne({ dni: value.dni });
      if (socioConMismoDni) {
        return res.status(409).json({
          error: 'DNI duplicado',
          message: `Ya existe otro socio con el DNI ${value.dni}`
        });
      }
    }
    
    // Actualizar socio manteniendo numeroSocio y timestamps originales
    const socioActualizado = await Socio.findByIdAndUpdate(
      req.params.id,
      {
        nombre: value.nombre,
        apellido: value.apellido,
        foto: value.foto,
        dni: value.dni,
        activo: value.activo
      },
      { 
        new: true, // Retorna el documento actualizado
        runValidators: true // Ejecuta validaciones del schema
      }
    );
    
    res.json({
      message: 'Socio actualizado exitosamente',
      socio: socioActualizado
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID proporcionado no es válido'
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'DNI duplicado',
        message: `Ya existe otro socio con el DNI ${req.body.dni}`
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

//-------------------------
// DELETE /api/socios/:id - Eliminar un socio
//-------------------------
router.delete('/:id', async (req, res) => {
  try {
    const socio = await Socio.findByIdAndDelete(req.params.id);
    
    if (!socio) {
      return res.status(404).json({
        error: 'Socio no encontrado',
        message: `No existe un socio con el ID ${req.params.id}`
      });
    }
    
    res.json({
      message: 'Socio eliminado exitosamente',
      socio: socio
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID proporcionado no es válido'
      });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

module.exports = router;
