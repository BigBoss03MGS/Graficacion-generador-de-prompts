import Prompt from '../modelos/Prompt.js';
import Documento from '../modelos/Documento.js';
import { detectarTipoProyecto, detectarTecnologias, extraerRequisitos } from '../servicios/analizador.servicio.js';
import { construirPrompt } from '../servicios/constructorPrompt.servicio.js';
import { mejorarPromptConIA } from '../servicios/ia.servicio.js';
import { respuestaExito, respuestaError } from '../utils/respuesta.util.js';

// POST /api/prompts/generar
export const generarPrompt = async (req, res, next) => {
  try {
    const { documentoId } = req.body;

    if (!documentoId) {
      return respuestaError(res, 'El ID del documento es obligatorio', 400);
    }

    // Obtiene el documento de la base de datos
    const documento = await Documento.findOne({
      _id: documentoId,
      usuario: req.usuario._id,
    });

    if (!documento) {
      return respuestaError(res, 'Documento no encontrado', 404);
    }

    const texto = documento.contenidoTexto;

    // Analiza el documento
    const tipoProyecto = detectarTipoProyecto(texto);
    const tecnologiasDetectadas = detectarTecnologias(texto);
    const { requisitosFuncionales, requisitosNoFuncionales } = extraerRequisitos(texto);

    // Construye el prompt estructurado localmente
    const datosPrompt = construirPrompt({
      tipoProyecto,
      tecnologiasDetectadas,
      requisitosFuncionales,
      requisitosNoFuncionales,
      textoOriginal: texto,
    });

    // Intenta mejorar el prompt con IA (si falla usa el local)
    const promptMejorado = await mejorarPromptConIA(texto, tipoProyecto);
    const promptFinal = promptMejorado || datosPrompt.promptFinal;

    // Guarda el prompt en la base de datos
    const nuevoPrompt = await Prompt.create({
      usuario: req.usuario._id,
      documento: documento._id,
      tipoProyecto,
      tecnologiasDetectadas,
      contenido: {
        contextoProyecto: datosPrompt.contextoProyecto,
        requisitosFuncionales: datosPrompt.requisitosFuncionales,
        requisitosNoFuncionales: datosPrompt.requisitosNoFuncionales,
        stackTecnologico: datosPrompt.stackTecnologico,
        arquitecturaSugerida: datosPrompt.arquitecturaSugerida,
        estructuraCarpetas: datosPrompt.estructuraCarpetas,
        componentesPrincipales: datosPrompt.componentesPrincipales,
        guiaImplementacion: datosPrompt.guiaImplementacion,
        checklistCompleto: datosPrompt.checklistCompleto,
      },
      promptFinal,
    });

    // Marca el documento como procesado
    await Documento.findByIdAndUpdate(documento._id, { procesado: true });

    return respuestaExito(
      res,
      { prompt: nuevoPrompt },
      'Prompt generado correctamente',
      201
    );
  } catch (error) {
    next(error);
  }
};