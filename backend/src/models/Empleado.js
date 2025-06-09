const mongoose = require('mongoose');

//-------------------------
// ESQUEMA DE EMPLEADO - MongoDB Schema
//-------------------------
const empleadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
    maxlength: [50, 'El apellido no puede exceder 50 caracteres']
  },
  
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'El email debe tener un formato válido']
  },
  
  dni: {
    type: String,
    required: [true, 'El DNI es requerido'],
    unique: true,
    trim: true,
    match: [/^[0-9]{7,8}$/, 'El DNI debe tener 7 u 8 dígitos']
  },
  
  puesto: {
    type: String,
    required: [true, 'El puesto es requerido'],
    trim: true,
    minlength: [2, 'El puesto debe tener al menos 2 caracteres'],
    maxlength: [50, 'El puesto no puede exceder 50 caracteres']
  },
  
  salario: {
    type: Number,
    required: [true, 'El salario es requerido'],
    min: [0, 'El salario debe ser un número positivo']
  },
  
  fechaIngreso: {
    type: Date,
    required: [true, 'La fecha de ingreso es requerida']
  },
  
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

//-------------------------
// ÍNDICES PARA OPTIMIZACIÓN
//-------------------------
empleadoSchema.index({ dni: 1 });
empleadoSchema.index({ email: 1 });
empleadoSchema.index({ apellido: 1, nombre: 1 });
empleadoSchema.index({ activo: 1 });

//-------------------------
// MÉTODOS VIRTUALES Y DE INSTANCIA
//-------------------------
empleadoSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombre} ${this.apellido}`;
});

empleadoSchema.methods.toJSON = function() {
  const empleado = this.toObject();
  return empleado;
};

//-------------------------
// MIDDLEWARE PRE-SAVE
//-------------------------
empleadoSchema.pre('save', function(next) {
  // Validar que la fecha de ingreso no sea futura
  if (this.fechaIngreso && this.fechaIngreso > new Date()) {
    const error = new Error('La fecha de ingreso no puede ser futura');
    return next(error);
  }
  next();
});

const Empleado = mongoose.model('Empleado', empleadoSchema);

module.exports = Empleado;
