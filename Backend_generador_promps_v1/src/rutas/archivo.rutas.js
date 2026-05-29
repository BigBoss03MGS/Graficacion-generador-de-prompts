import { Router } from 'express';
import { subirArchivo, obtenerDocumentos, eliminarDocumento } from '../controladores/archivo.controlador.js';
import { verificarToken } from '../middlewares/authJWT.middleware.js';
import { subirArchivo as middlewareSubida } from '../middlewares/subirArchivo.middleware.js';

const router = Router();

// Todas las rutas de archivos requieren autenticación
router.use(verificarToken);

router.post('/subir', middlewareSubida.single('archivo'), subirArchivo);
router.get('/', obtenerDocumentos);
router.delete('/:id', eliminarDocumento);

export default router;