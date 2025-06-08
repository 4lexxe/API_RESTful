const express = require('express');
const Empleado = require('../models/Empleado');
const { validateEmpleado } = require('../validators/empleadosValidator');

const router = express.Router();

//-------------------------
// GET /api/empleados - Obtener todos los empleados
//-------------------------
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Crear filtro de búsqueda opcional
    const filter = {};
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { apellido: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { dni: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Buscar empleados con filtros y paginación
    const empleados = await Empleado.find(filter)
      .sort({ apellido: 1, nombre: 1 }) // Ordenar por apellido y nombre
      .skip(skip)
      .limit(limitNum);
    
    // Contar total para paginación
    const total = await Empleado.countDocuments(filter);
    
    res.json({
      message: 'Empleados recuperados exitosamente',
      empleados,
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
// GET /api/empleados/:id - Obtener UN empleado por ID
//-------------------------
router.get('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    
    if (!empleado) {
      return res.status(404).json({
        error: 'Empleado no encontrado',
        message: `No existe un empleado con el ID ${req.params.id}`
      });
    }
    
    res.json({
      message: 'Empleado encontrado exitosamente',
      empleado
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
