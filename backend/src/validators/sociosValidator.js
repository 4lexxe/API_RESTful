const Joi = require('joi');

//-------------------------
// Schema para validar datos de socio
//-------------------------
const socioSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres'
    }),
  
  apellido: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 2 caracteres'
    }),
  
  foto: Joi.string()
    .uri()
    .required()
    .messages({
      'string.empty': 'La URL de la foto es requerida',
      'string.uri': 'La foto debe ser una URL válida'
    }),
  
  dni: Joi.string()
    .pattern(/^\d{7,8}$/)
    .required()
    .messages({
      'string.empty': 'El DNI es requerido',
      'string.pattern.base': 'El DNI debe tener 7 u 8 dígitos'
    }),
  
  activo: Joi.boolean()
    .default(true)
});

//-------------------------
// Schema para actualizar socio (todos los campos requeridos para PUT)
//-------------------------
const updateSocioSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres'
    }),
  
  apellido: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 2 caracteres'
    }),
  
  foto: Joi.string()
    .uri()
    .required()
    .messages({
      'string.empty': 'La URL de la foto es requerida',
      'string.uri': 'La foto debe ser una URL válida'
    }),
  
  dni: Joi.string()
    .pattern(/^\d{7,8}$/)
    .required()
    .messages({
      'string.empty': 'El DNI es requerido',
      'string.pattern.base': 'El DNI debe tener 7 u 8 dígitos'
    }),
  
  activo: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'El campo activo debe ser verdadero o falso'
    })
});

//-------------------------
// Funciones de validación
//-------------------------
const validateSocio = (data) => {
  return socioSchema.validate(data);
};

const validateUpdateSocio = (data) => {
  return updateSocioSchema.validate(data);
};

module.exports = {
  validateSocio,
  validateUpdateSocio
};
