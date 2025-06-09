const Joi = require('joi');

//-------------------------
// VALIDADOR PARA EMPLEADOS - Joi Schema
//-------------------------
const empleadoSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'any.required': 'El nombre es requerido'
    }),

  apellido: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 50 caracteres',
      'any.required': 'El apellido es requerido'
    }),

  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'El email es requerido',
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),

  dni: Joi.string()
    .pattern(/^[0-9]{7,8}$/)
    .required()
    .trim()
    .messages({
      'string.empty': 'El DNI es requerido',
      'string.pattern.base': 'El DNI debe tener 7 u 8 dígitos',
      'any.required': 'El DNI es requerido'
    }),

  puesto: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.empty': 'El puesto es requerido',
      'string.min': 'El puesto debe tener al menos 2 caracteres',
      'string.max': 'El puesto no puede exceder 50 caracteres',
      'any.required': 'El puesto es requerido'
    }),

  salario: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'El salario debe ser un número',
      'number.positive': 'El salario debe ser un número positivo',
      'any.required': 'El salario es requerido'
    }),

  fechaIngreso: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'La fecha de ingreso debe ser una fecha válida',
      'date.format': 'La fecha de ingreso debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'La fecha de ingreso es requerida'
    }),

  activo: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado activo debe ser verdadero o falso'
    })
});

//-------------------------
// FUNCIÓN DE VALIDACIÓN
//-------------------------
const validateEmpleado = (data) => {
  return empleadoSchema.validate(data, { 
    abortEarly: false,
    stripUnknown: true 
  });
};

module.exports = {
  validateEmpleado,
  empleadoSchema
};
