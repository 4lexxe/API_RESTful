const Joi = require('joi');

//-------------------------
// Schema para validar datos de transacción
//-------------------------
const transaccionSchema = Joi.object({
  idiomaOrigen: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El idioma de origen es requerido',
      'string.min': 'El idioma de origen debe tener al menos 2 caracteres',
      'string.max': 'El idioma de origen no puede exceder 50 caracteres'
    }),
  
  textoOrigen: Joi.string()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'string.empty': 'El texto de origen es requerido',
      'string.min': 'El texto de origen no puede estar vacío',
      'string.max': 'El texto de origen no puede exceder 5000 caracteres'
    }),
  
  idiomaDestino: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El idioma de destino es requerido',
      'string.min': 'El idioma de destino debe tener al menos 2 caracteres',
      'string.max': 'El idioma de destino no puede exceder 50 caracteres'
    }),
  
  textoDestino: Joi.string()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'string.empty': 'El texto de destino es requerido',
      'string.min': 'El texto de destino no puede estar vacío',
      'string.max': 'El texto de destino no puede exceder 5000 caracteres'
    }),
  
  emailCliente: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'El email del cliente es requerido',
      'string.email': 'El email debe tener un formato válido'
    })
});

//-------------------------
// Función de validación
//-------------------------
const validateTransaccion = (data) => {
  return transaccionSchema.validate(data);
};

module.exports = {
  validateTransaccion
};
