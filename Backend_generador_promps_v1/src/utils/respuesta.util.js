// Formato estándar para todas las respuestas del API
export const respuestaExito = (res, datos, mensaje = 'Operación exitosa', codigo = 200) => {
  return res.status(codigo).json({
    exito: true,
    mensaje,
    datos,
  });
};

export const respuestaError = (res, mensaje = 'Error interno del servidor', codigo = 500) => {
  return res.status(codigo).json({
    exito: false,
    mensaje,
    datos: null,
  });
};