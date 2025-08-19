import mongoose from 'mongoose';

const vagaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  requisitos: {
    type: String,
    required: true
  },
  local: {
    type: String,
    required: true,
    trim: true
  },
  salario: {
    type: String,
    required: true,
    trim: true
  },
  vagaId: {
    type: String,
    required: true,
    trim: true
  },
  embedding: {
    type: [Number],
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

vagaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Vaga || mongoose.model('Vaga', vagaSchema);
