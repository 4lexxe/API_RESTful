const mongoose = require('mongoose');

//-------------------------
// Schema de Transaccion para MongoDB (LOG de operaciones)
//-------------------------
const transaccionSchema = new mongoose.Schema({
  idiomaOrigen: {
    type: String,
    required: [true, 'El idioma de origen es requerido'],
    trim: true,
    minlength: [2, 'El idioma de origen debe tener al menos 2 caracteres'],
    maxlength: [50, 'El idioma de origen no puede exceder 50 caracteres']
  },
  textoOrigen: {
    type: String,
    required: [true, 'El texto de origen es requerido'],
    trim: true,
    minlength: [1, 'El texto de origen no puede estar vacío'],
    maxlength: [5000, 'El texto de origen no puede exceder 5000 caracteres']
  },
  idiomaDestino: {
    type: String,
    required: [true, 'El idioma de destino es requerido'],
    trim: true,
    minlength: [2, 'El idioma de destino debe tener al menos 2 caracteres'],
    maxlength: [50, 'El idioma de destino no puede exceder 50 caracteres']
  },
  textoDestino: {
    type: String,
    required: [true, 'El texto de destino es requerido'],
    trim: true,
    minlength: [1, 'El texto de destino no puede estar vacío'],
    maxlength: [5000, 'El texto de destino no puede exceder 5000 caracteres']
  },
  emailCliente: {
    type: String,
    required: [true, 'El email del cliente es requerido'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'El email debe tener un formato válido'
    }
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

//-------------------------
// Índices para mejorar performance
//-------------------------
transaccionSchema.index({ emailCliente: 1 });
transaccionSchema.index({ idiomaOrigen: 1 });
transaccionSchema.index({ idiomaDestino: 1 });
transaccionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaccion', transaccionSchema);
