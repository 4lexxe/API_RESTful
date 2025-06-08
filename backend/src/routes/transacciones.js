const express = require('express');
const Transaccion = require('../models/Transaccion');
const { validateTransaccion } = require('../validators/transaccionesValidator');

const router = express.Router();

//-------------------------
// GET /api/transacciones - Recuperar TODAS las transacciones registradas
//-------------------------
router.get('/', async (req, res) => {
  try {
    const { emailCliente, idiomaOrigen, idiomaDestino, page = 1, limit = 10 } = req.query;
    
    // Crear filtros opcionales
    const filter = {};
    if (emailCliente) {
      filter.emailCliente = { $regex: emailCliente, $options: 'i' }; // Búsqueda case-insensitive
    }
    if (idiomaOrigen) {
      filter.idiomaOrigen = { $regex: idiomaOrigen, $options: 'i' };
    }
    if (idiomaDestino) {
      filter.idiomaDestino = { $regex: idiomaDestino, $options: 'i' };
    }
    
    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Buscar transacciones con filtros y paginación
    const transacciones = await Transaccion.find(filter)
      .sort({ createdAt: -1 }) // Más recientes primero
      .skip(skip)
      .limit(limitNum);
    
    // Contar total para paginación
    const total = await Transaccion.countDocuments(filter);
    
    res.json({
      message: 'Transacciones recuperadas exitosamente',
      transacciones,
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
// GET /api/transacciones/cliente/:email - Recuperar histórico de transacciones por email
//-------------------------
router.get('/cliente/:email', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const emailCliente = req.params.email.toLowerCase();
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailCliente)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'El formato del email proporcionado no es válido'
      });
    }
    
    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Buscar transacciones del cliente específico
    const transacciones = await Transaccion.find({ emailCliente: emailCliente })
      .sort({ createdAt: -1 }) // Más recientes primero
      .skip(skip)
      .limit(limitNum);
    
    // Contar total para paginación
    const total = await Transaccion.countDocuments({ emailCliente: emailCliente });
    
    // Si no hay transacciones
    if (total === 0) {
      return res.json({
        message: 'No se encontraron transacciones para este cliente',
        emailCliente,
        transacciones: [],
        pagination: {
          total: 0,
          page: pageNum,
          limit: limitNum,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }
    
    res.json({
      message: 'Histórico de transacciones recuperado exitosamente',
      emailCliente,
      transacciones,
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
