export const manejadorErrores = (err, req, res, next) => {
  console.error('❌ Error completo:', err.stack || err.message);

  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      exito: false,
      mensaje: mensajes.join(', '),
      datos: null,
    });
  }

  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      exito: false,
      mensaje: `El ${campo} ya está registrado`,
      datos: null,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token inválido',
      datos: null,
    });
  }

  return res.status(err.codigo || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
    datos: null,
  });
};