import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    documento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Documento',
      required: true,
    },
    tipoProyecto: {
      type: String,
      enum: [
        'web_spa',
        'web_mpa',
        'api_rest',
        'api_graphql',
        'movil',
        'escritorio',
        'microservicios',
        'cms',
        'ecommerce',
        'dashboard',
      ],
      required: true,
    },
    tecnologiasDetectadas: {
      type: [String],
      default: [],
    },
    contenido: {
      contextoProyecto: { type: String, default: '' },
      requisitosFuncionales: { type: [String], default: [] },
      requisitosNoFuncionales: { type: [String], default: [] },
      stackTecnologico: { type: [String], default: [] },
      arquitecturaSugerida: { type: String, default: '' },
      estructuraCarpetas: { type: String, default: '' },
      componentesPrincipales: { type: [String], default: [] },
      guiaImplementacion: { type: [String], default: [] },
      checklistCompleto: { type: [String], default: [] },
    },
    promptFinal: {
      type: String,
      required: true,
    },
    favorito: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;