const express = require('express');
const Publicacion = require('../models/Publicacion');
const Empleado = require('../models/Empleado');
const { validatePublicacion, validateUpdatePublicacion } = require('../validators/publicacionesValidator');

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

//-------------------------
// GET /api/publicaciones - Recuperar TODAS las publicaciones con información de empleados
//-------------------------
router.get('/', async (req, res) => {
  try {
    const { vigente, empleado, page = 1, limit = 10 } = req.query;
    
    // Crear filtros opcionales
    const filter = {};
    if (vigente !== undefined) {
      filter.vigente = vigente === 'true';
    }
    if (empleado) {
      filter.empleado = empleado;
    }
    
    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Buscar publicaciones con filtros y paginación, incluyendo datos del empleado
    const publicaciones = await Publicacion.find(filter)
      .populate('empleado', 'nombre apellido email dni') // Incluir datos del empleado
      .sort({ createdAt: -1 }) // Más recientes primero
      .skip(skip)
      .limit(limitNum);
    
    // Contar total para paginación
    const total = await Publicacion.countDocuments(filter);
    
    res.json({
      message: 'Publicaciones recuperadas exitosamente',
      publicaciones,
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
// PUT /api/publicaciones/:id - Modificar una publicación completa
//-------------------------
router.put('/:id', async (req, res) => {
  try {
    // Validar datos
    const { error, value } = validateUpdatePublicacion(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: error.details[0].message
      });
    }
    
    // Buscar la publicación
    const publicacion = await Publicacion.findById(req.params.id);
    
    if (!publicacion) {
      return res.status(404).json({
        error: 'Publicación no encontrada',
        message: `No existe una publicación con el ID ${req.params.id}`
      });
    }
    
    // Verificar que el empleado existe (si se cambió)
    if (value.empleado !== publicacion.empleado.toString()) {
      const empleadoExiste = await Empleado.findById(value.empleado);
      if (!empleadoExiste) {
        return res.status(404).json({
          error: 'Empleado no encontrado',
          message: `No existe un empleado con el ID ${value.empleado}`
        });
      }
    }
    
    // Actualizar publicación manteniendo timestamps originales
    const publicacionActualizada = await Publicacion.findByIdAndUpdate(
      req.params.id,
      {
        titulo: value.titulo,
        contenido: value.contenido,
        imagenAsociada: value.imagenAsociada,
        fechaPublicacion: value.fechaPublicacion,
        empleado: value.empleado,
        vigente: value.vigente
      },
      { 
        new: true, // Retorna el documento actualizado
        runValidators: true // Ejecuta validaciones del schema
      }
    );
    
    // Populate para incluir datos del empleado
    await publicacionActualizada.populate('empleado', 'nombre apellido email dni');
    
    res.json({
      message: 'Publicación actualizada exitosamente',
      publicacion: publicacionActualizada
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID proporcionado no es válido'
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
// DELETE /api/publicaciones/:id - Eliminar una publicación
//-------------------------
router.delete('/:id', async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndDelete(req.params.id);
    
    if (!publicacion) {
      return res.status(404).json({
        error: 'Publicación no encontrada',
        message: `No existe una publicación con el ID ${req.params.id}`
      });
    }
    
    // Populate para mostrar información del empleado en la respuesta
    await publicacion.populate('empleado', 'nombre apellido email');
    
    res.json({
      message: 'Publicación eliminada exitosamente',
      publicacion: publicacion
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
