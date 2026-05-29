import { Router } from 'express';
import {
  obtenerHistorial,
  obtenerPromptPorId,
  toggleFavorito,
  eliminarPrompt,
} from '../controladores/historial.controlador.js';
import { verificarToken } from '../middlewares/authJWT.middleware.js';

const router = Router();

// Todas las rutas del historial requieren autenticación
router.use(verificarToken);

router.get('/', obtenerHistorial);
router.get('/:id', obtenerPromptPorId);
router.patch('/:id/favorito', toggleFavorito);
router.delete('/:id', eliminarPrompt);

export default router;