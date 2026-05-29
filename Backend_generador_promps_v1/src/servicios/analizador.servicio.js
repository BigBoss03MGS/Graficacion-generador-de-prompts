// Detecta el tipo de proyecto basándose en el texto del documento
export const detectarTipoProyecto = (texto) => {
  const textoMinusculas = texto.toLowerCase();

  const patrones = {
    ecommerce: ['carrito', 'tienda', 'producto', 'pago', 'checkout', 'shop', 'store', 'commerce'],
    api_rest: ['api rest', 'endpoint', 'rest api', 'swagger', 'postman', 'crud'],
    api_graphql: ['graphql', 'query', 'mutation', 'resolver', 'schema'],
    microservicios: ['microservicio', 'microservice', 'docker', 'kubernetes', 'contenedor'],
    movil: ['android', 'ios', 'react native', 'flutter', 'móvil', 'mobile', 'app store'],
    escritorio: ['escritorio', 'desktop', 'electron', 'windows app', 'tauri'],
    cms: ['cms', 'contenido', 'blog', 'wordpress', 'strapi', 'contentful'],
    dashboard: ['dashboard', 'panel', 'reportes', 'métricas', 'analytics', 'gráfica'],
    web_spa: ['react', 'angular', 'vue', 'spa', 'single page'],
    web_mpa: ['servidor', 'plantillas', 'ssr', 'next.js', 'nuxt', 'multi page'],
  };

  // Cuenta cuántas coincidencias tiene cada tipo
  const puntajes = {};
  for (const [tipo, palabras] of Object.entries(patrones)) {
    puntajes[tipo] = palabras.filter((palabra) =>
      textoMinusculas.includes(palabra)
    ).length;
  }

  // Retorna el tipo con más coincidencias
  const tipoDetectado = Object.entries(puntajes).sort((a, b) => b[1] - a[1])[0];

  // Si no hay coincidencias claras, por defecto es web_spa
  return tipoDetectado[1] > 0 ? tipoDetectado[0] : 'web_spa';
};

// Detecta las tecnologías mencionadas en el texto
export const detectarTecnologias = (texto) => {
  const textoMinusculas = texto.toLowerCase();

  const tecnologias = [
    // Frontend
    'angular', 'react', 'vue', 'svelte', 'nextjs', 'nuxt',
    'tailwind', 'bootstrap', 'sass', 'typescript', 'javascript',
    // Backend
    'nodejs', 'node.js', 'express', 'nestjs', 'fastify',
    'django', 'flask', 'laravel', 'spring', 'rails',
    // Bases de datos
    'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis',
    'firebase', 'supabase', 'prisma', 'mongoose',
    // DevOps / otros
    'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'graphql', 'rest', 'websocket', 'jwt', 'oauth',
  ];

  return tecnologias.filter((tech) => textoMinusculas.includes(tech));
};

// Extrae los requisitos del texto buscando patrones comunes
export const extraerRequisitos = (texto) => {
  const lineas = texto.split('\n').map((l) => l.trim()).filter(Boolean);

  const requisitosFuncionales = [];
  const requisitosNoFuncionales = [];

  // Palabras clave que indican requisitos funcionales
  const palabrasFuncionales = [
    'debe', 'permitir', 'poder', 'gestionar', 'registrar',
    'autenticar', 'mostrar', 'generar', 'enviar', 'guardar',
    'buscar', 'filtrar', 'exportar', 'importar', 'notificar',
  ];

  // Palabras clave que indican requisitos no funcionales
  const palabrasNoFuncionales = [
    'rendimiento', 'seguridad', 'escalable', 'disponibilidad',
    'tiempo de respuesta', 'cifrado', 'encriptado', 'backup',
    'mantenible', 'accesible', 'responsive', 'velocidad',
  ];

  lineas.forEach((linea) => {
    const lineaMin = linea.toLowerCase();

    const esFuncional = palabrasFuncionales.some((p) => lineaMin.includes(p));
    const esNoFuncional = palabrasNoFuncionales.some((p) => lineaMin.includes(p));

    if (esFuncional && linea.length > 15) {
      requisitosFuncionales.push(linea);
    } else if (esNoFuncional && linea.length > 15) {
      requisitosNoFuncionales.push(linea);
    }
  });

  return { requisitosFuncionales, requisitosNoFuncionales };
};