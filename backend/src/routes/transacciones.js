const express = require('express');
const Transaccion = require('../models/Transaccion');
const { validateTransaccion } = require('../validators/transaccionesValidator');

const router = express.Router();

//-------------------------
// POST /api/transacciones - Registrar nueva transacción
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

//-------------------------
// GET /api/transacciones - Obtener todas las transacciones
//-------------------------
router.get('/', async (req, res) => {
  try {
    const { emailCliente, idiomaOrigen, idiomaDestino, page = 1, limit = 10 } = req.query;
    
    // Crear filtro opcional
    const filter = {};
    if (emailCliente) {
      filter.emailCliente = new RegExp(emailCliente, 'i');
    }
    if (idiomaOrigen) {
      filter.idiomaOrigen = idiomaOrigen;
    }
    if (idiomaDestino) {
      filter.idiomaDestino = idiomaDestino;
    }
    
    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Buscar transacciones con filtros y paginación
    const transacciones = await Transaccion.find(filter)
      .sort({ createdAt: -1 })
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
// GET /api/transacciones/cliente/:email - Transacciones por cliente
//-------------------------
router.get('/cliente/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Buscar transacciones por email
    const transacciones = await Transaccion.find({ emailCliente: email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Contar total para paginación
    const total = await Transaccion.countDocuments({ emailCliente: email });
    
    res.json({
      message: `Transacciones del cliente ${email} recuperadas exitosamente`,
      emailCliente: email,
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
// GET /api/transacciones/idiomas/:origen/:destino - Transacciones por idiomas
//-------------------------
router.get('/idiomas/:origen/:destino', async (req, res) => {
  try {
    const { origen, destino } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Buscar transacciones por idiomas
    const transacciones = await Transaccion.find({ 
      idiomaOrigen: origen,
      idiomaDestino: destino
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Contar total para paginación
    const total = await Transaccion.countDocuments({ 
      idiomaOrigen: origen,
      idiomaDestino: destino
    });
    
    res.json({
      message: `Transacciones de ${origen} a ${destino} recuperadas exitosamente`,
      filtros: { idiomaOrigen: origen, idiomaDestino: destino },
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

module.exports = router;
