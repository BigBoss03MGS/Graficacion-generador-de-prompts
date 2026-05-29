import jwt from 'jsonwebtoken';
import { variables } from '../config/variables.js';
import Usuario from '../modelos/Usuario.js';
import { respuestaError } from '../utils/respuesta.util.js';

export const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return respuestaError(res, 'Token no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, variables.jwtSecreto);
    const usuario = await Usuario.findById(decoded.id).select('-contrasena');

    if (!usuario || !usuario.activo) {
      return respuestaError(res, 'Usuario no encontrado o inactivo', 401);
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return respuestaError(res, 'Token inválido o expirado', 401);
  }
};