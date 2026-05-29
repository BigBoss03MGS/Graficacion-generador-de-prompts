import { Router } from 'express';
import { generarPrompt } from '../controladores/prompt.controlador.js';
import { verificarToken } from '../middlewares/authJWT.middleware.js';

const router = Router();

// Todas las rutas de prompts requieren autenticación
router.use(verificarToken);

router.post('/generar', generarPrompt);

export default router;