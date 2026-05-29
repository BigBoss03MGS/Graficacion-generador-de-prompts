import jwt from 'jsonwebtoken';
import Usuario from '../modelos/Usuario.js';
import { variables } from '../config/variables.js';
import { respuestaExito, respuestaError } from '../utils/respuesta.util.js';

/*
Genera un token JWT para el usuario autenticado
recibe el id de la base de datos (mongodb) y 
retorna el token firmado
*/
const generarToken = (id) => {
  return jwt.sign({ id }, variables.jwtSecreto, {
    expiresIn: variables.jwtExpiracion,
  });
};
/*
Registra un usuario en la pagina con los campos
nombre, email y contraseña
*/
//endpoint POST /api/auth/registro
export const registro = async (req, res, next) => {
  try {
    const { nombre, email, contrasena } = req.body;

    /*
    Verifica que los tres campos esten completos, en dado caso que no retorna en un mensaje
    de error
    */
    if (!nombre || !email || !contrasena) {
      return respuestaError(res, 'Todos los campos son obligatorios', 400);
    }

    /*
    Verifica si el correo puesto por el usuario ya esta registrado, en dado caso que no
    retorna un mensaje de error
    */
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return respuestaError(res, 'El email ya está registrado', 400);
    }

    //Creacion de usuario (la contraseña se encripta automaticamente)
    const nuevoUsuario = await Usuario.create({ nombre, email, contrasena });
    const token = generarToken(nuevoUsuario._id);

    return respuestaExito(
      res,
      {
        token,
        usuario: {
          id: nuevoUsuario._id,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
        },
      },
      'Usuario registrado correctamente',
      201
    );
  } catch (error) {
    next(error);
  }
};

/*
Se autentica un usuario ya registrado y retorna en un token JWT
solo pide correo y contraseña para su ingreso
*/
//Endpoint POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;

    //Verifica que los campos esten llenos en dado caso que no retorna en mensaje de error
    if (!email || !contrasena) {
      return respuestaError(res, 'Email y contraseña son obligatorios', 400);
    }

    //Log para depuracion
    console.log('📧 Buscando usuario:', email);

    /*
    Busca el usuario por el correo electronico, en 
    dado caso de no encontrarlo retorna en mensaje de error
    */
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      //Log de depuracion
      console.log('ERROR: Usuario no encontrado');
      return respuestaError(res, 'Credenciales incorrectas', 401);
    }

    //Logs de depuracion
    console.log('Mensaje: Usuario encontrado:', usuario.email);
    console.log('Contrasena guardada:', usuario.contrasena);

    /*Compara la constraseña introducida con la contraseña encriptada de 
    la base de datos (Mongodb) en dado caso que no sea la misma 
    retorna en un mensaje de error
    */
    const contrasenaCorrecta = await usuario.compararContrasena(contrasena);
    //log de depuracion
    console.log('Contrasena correcta:', contrasenaCorrecta);
    if (!contrasenaCorrecta) {
      return respuestaError(res, 'Credenciales incorrectas', 401);
    }

    const token = generarToken(usuario._id);

    return respuestaExito(res, {
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    }, 'Login exitoso');
  } catch (error) {
    next(error);
  }
};

/*
Retorna al perfil del usuario ya autenticado, se requiere
token JWT valido para el header Authorization
*/
//Endpoint GET /api/auth/perfil
export const obtenerPerfil = async (req, res, next) => {
  try {
    //req.usuario es inyectado por el middleware verificarToken
    return respuestaExito(res, {
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        creadoEn: req.usuario.createdAt,
      },
    }, 'Perfil obtenido correctamente');
  } catch (error) {
    next(error);
  }
};