import mongoose from 'mongoose';

const documentoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    nombreArchivo: {
      type: String,
      required: true,
      trim: true,
    },
    tipoArchivo: {
      type: String,
      enum: ['pdf', 'word', 'markdown', 'txt'],
      required: true,
    },
    contenidoTexto: {
      type: String,
      required: true,
    },
    tamanoBytes: {
      type: Number,
      required: true,
    },
    procesado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Documento = mongoose.model('Documento', documentoSchema);

export default Documento;