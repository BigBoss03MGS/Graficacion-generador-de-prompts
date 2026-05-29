import { Router } from 'express';
import { registro, login, obtenerPerfil } from '../controladores/auth.controlador.js';
import { verificarToken } from '../middlewares/authJWT.middleware.js';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', verificarToken, obtenerPerfil);

export default router;