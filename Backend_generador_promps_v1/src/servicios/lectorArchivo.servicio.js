import fs from 'fs';
import mammoth from 'mammoth';
import { obtenerTipoArchivo } from '../utils/validaciones.util.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Extrae el texto según el tipo de archivo
export const extraerTexto = async (archivo) => {
  const tipoArchivo = obtenerTipoArchivo(archivo.originalname);
  const rutaArchivo = archivo.path;

  try {
    let textoExtraido = '';

    switch (tipoArchivo) {
      case 'pdf':
        textoExtraido = await leerPDF(rutaArchivo);
        break;
      case 'word':
        textoExtraido = await leerWord(rutaArchivo);
        break;
      case 'markdown':
        textoExtraido = await leerMarkdown(rutaArchivo);
        break;
      case 'txt':
        textoExtraido = await leerTXT(rutaArchivo);
        break;
      default:
        throw new Error('Tipo de archivo no soportado');
    }

    eliminarArchivoTemporal(rutaArchivo);

    return {
      texto: textoExtraido,
      tipoArchivo,
      nombreArchivo: archivo.originalname,
      tamanoBytes: archivo.size,
    };
  } catch (error) {
    eliminarArchivoTemporal(rutaArchivo);
    throw new Error(`Error al leer el archivo: ${error.message}`);
  }
};

const leerPDF = async (rutaArchivo) => {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(fs.readFileSync(rutaArchivo));
    const documento = await pdfjsLib.getDocument({ data }).promise;
    let textoCompleto = '';

    for (let i = 1; i <= documento.numPages; i++) {
      const pagina = await documento.getPage(i);
      const contenido = await pagina.getTextContent();
      const textoPagina = contenido.items
        .map((item) => item.str)
        .join(' ');
      textoCompleto += textoPagina + '\n';
    }

    return textoCompleto;
  } catch (error) {
    throw new Error(`Error leyendo PDF: ${error.message}`);
  }
};

const leerWord = async (rutaArchivo) => {
  const resultado = await mammoth.extractRawText({ path: rutaArchivo });
  return resultado.value;
};

const leerMarkdown = async (rutaArchivo) => {
  const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
  const textoPlano = contenido
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')
    .replace(/`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/>\s/g, '')
    .trim();
  return textoPlano;
};

const leerTXT = async (rutaArchivo) => {
  return fs.readFileSync(rutaArchivo, 'utf-8');
};

const eliminarArchivoTemporal = (rutaArchivo) => {
  try {
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }
  } catch (error) {
    console.error('⚠️ No se pudo eliminar el archivo temporal:', error.message);
  }
};