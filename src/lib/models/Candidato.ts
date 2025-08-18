import mongoose from 'mongoose';

const candidatoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  vagaId: {
    type: String,
    required: true,
    ref: 'Vaga'
  },
  textoCurriculo: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  observacoes: {
    type: String,
    default: ''
  },
  fitScore: {
    type: Number,
    default: 0
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

candidatoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Índice para melhorar performance nas consultas
candidatoSchema.index({ vagaId: 1 });

export default mongoose.models.Candidato || mongoose.model('Candidato', candidatoSchema);
