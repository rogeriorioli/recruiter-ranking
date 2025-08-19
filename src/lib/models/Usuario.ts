import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  senha: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

usuarioSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Removido índice duplicado - já definido no campo email

export default mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);
