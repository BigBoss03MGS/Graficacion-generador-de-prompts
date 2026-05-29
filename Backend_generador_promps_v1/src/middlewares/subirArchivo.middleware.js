import multer from 'multer';
import { esArchivoValido } from '../utils/validaciones.util.js';

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const nombreUnico = `${Date.now()}-${file.originalname}`;
    cb(null, nombreUnico);
  },
});

const filtroArchivos = (req, file, cb) => {
  if (esArchivoValido(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo PDF, Word, Markdown y TXT'), false);
  }
};

export const subirArchivo = multer({
  storage: almacenamiento,
  fileFilter: filtroArchivos,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});