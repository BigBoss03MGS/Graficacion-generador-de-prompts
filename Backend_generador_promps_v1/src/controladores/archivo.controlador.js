import Documento from '../modelos/Documento.js';
import { extraerTexto } from '../servicios/lectorArchivo.servicio.js';
import { respuestaExito, respuestaError } from '../utils/respuesta.util.js';

// POST /api/archivos/subir
export const subirArchivo = async (req, res, next) => {
  try {
    // Verifica que se haya subido un archivo
    if (!req.file) {
      return respuestaError(res, 'No se proporcionó ningún archivo', 400);
    }

    // Extrae el texto del archivo
    const { texto, tipoArchivo, nombreArchivo, tamanoBytes } = await extraerTexto(req.file);

    // Verifica que se haya podido extraer texto
    if (!texto || texto.trim().length === 0) {
      return respuestaError(res, 'No se pudo extraer texto del archivo', 400);
    }

    // Guarda el documento en la base de datos
    const nuevoDocumento = await Documento.create({
      usuario: req.usuario._id,
      nombreArchivo,
      tipoArchivo,
      contenidoTexto: texto,
      tamanoBytes,
      procesado: false,
    });

    return respuestaExito(
      res,
      {
        documentoId: nuevoDocumento._id,
        nombreArchivo: nuevoDocumento.nombreArchivo,
        tipoArchivo: nuevoDocumento.tipoArchivo,
        tamanoBytes: nuevoDocumento.tamanoBytes,
        textoPreview: texto.slice(0, 200) + '...',
      },
      'Archivo subido y procesado correctamente',
      201
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/archivos
export const obtenerDocumentos = async (req, res, next) => {
  try {
    const documentos = await Documento.find({ usuario: req.usuario._id })
      .select('-contenidoTexto') // no enviamos el texto completo en la lista
      .sort({ createdAt: -1 });

    return respuestaExito(res, { documentos }, 'Documentos obtenidos correctamente');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/archivos/:id
export const eliminarDocumento = async (req, res, next) => {
  try {
    const documento = await Documento.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!documento) {
      return respuestaError(res, 'Documento no encontrado', 404);
    }

    await documento.deleteOne();

    return respuestaExito(res, null, 'Documento eliminado correctamente');
  } catch (error) {
    next(error);
  }
};