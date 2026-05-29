// Valida que el archivo subido sea de un tipo permitido
export const esArchivoValido = (nombreArchivo) => {
  const extensionesPermitidas = ['.pdf', '.docx', '.md', '.txt'];
  const extension = nombreArchivo
    .slice(nombreArchivo.lastIndexOf('.'))
    .toLowerCase();
  return extensionesPermitidas.includes(extension);
};

// Obtiene el tipo de archivo a partir del nombre
export const obtenerTipoArchivo = (nombreArchivo) => {
  const extension = nombreArchivo
    .slice(nombreArchivo.lastIndexOf('.'))
    .toLowerCase();

  const tipos = {
    '.pdf': 'pdf',
    '.docx': 'word',
    '.md': 'markdown',
    '.txt': 'txt',
  };

  return tipos[extension] || null;
};