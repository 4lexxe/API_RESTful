const mongoose = require('mongoose');

//-------------------------
// Schema de Empleado para MongoDB
//-------------------------
const empleadoSchema = new mongoose.Schema({
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
    maxlength: [50, 'El apellido no puede exceder 50 caracteres']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  dni: {
    type: String,
    required: [true, 'El DNI es requerido'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{7,8}$/.test(v);
      },
      message: 'El DNI debe tener 7 u 8 dígitos'
    }
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
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
empleadoSchema.index({ dni: 1 });
empleadoSchema.index({ email: 1 });
empleadoSchema.index({ apellido: 1, nombre: 1 });

module.exports = mongoose.model('Empleado', empleadoSchema);
