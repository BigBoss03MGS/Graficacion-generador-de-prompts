import Prompt from '../modelos/Prompt.js';
import { respuestaExito, respuestaError } from '../utils/respuesta.util.js';

// GET /api/historial
export const obtenerHistorial = async (req, res, next) => {
  try {
    const prompts = await Prompt.find({ usuario: req.usuario._id })
      .populate('documento', 'nombreArchivo tipoArchivo')
      .select('-contenido') // no enviamos el detalle completo en la lista
      .sort({ createdAt: -1 });

    return respuestaExito(res, { prompts }, 'Historial obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

// GET /api/historial/:id
export const obtenerPromptPorId = async (req, res, next) => {
  try {
    const prompt = await Prompt.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    }).populate('documento', 'nombreArchivo tipoArchivo');

    if (!prompt) {
      return respuestaError(res, 'Prompt no encontrado', 404);
    }

    return respuestaExito(res, { prompt }, 'Prompt obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

// PATCH /api/historial/:id/favorito
export const toggleFavorito = async (req, res, next) => {
  try {
    const prompt = await Prompt.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!prompt) {
      return respuestaError(res, 'Prompt no encontrado', 404);
    }

    // Cambia el estado de favorito
    prompt.favorito = !prompt.favorito;
    await prompt.save();

    return respuestaExito(
      res,
      { favorito: prompt.favorito },
      prompt.favorito ? 'Agregado a favoritos' : 'Eliminado de favoritos'
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/historial/:id
export const eliminarPrompt = async (req, res, next) => {
  try {
    const prompt = await Prompt.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!prompt) {
      return respuestaError(res, 'Prompt no encontrado', 404);
    }

    await prompt.deleteOne();

    return respuestaExito(res, null, 'Prompt eliminado correctamente');
  } catch (error) {
    next(error);
  }
};