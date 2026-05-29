// Construye el prompt estructurado con toda la información analizada
export const construirPrompt = (datos) => {
  const {
    tipoProyecto,
    tecnologiasDetectadas,
    requisitosFuncionales,
    requisitosNoFuncionales,
    textoOriginal,
  } = datos;

  const nombreTipo = obtenerNombreTipo(tipoProyecto);

  const promptFinal = `
# Prompt para Generación de Código — ${nombreTipo}

## 🎯 Contexto del Proyecto
Estoy desarrollando una aplicación de tipo **${nombreTipo}**.
${textoOriginal.slice(0, 500)}...

## ✅ Requisitos Funcionales
${requisitosFuncionales.length > 0
  ? requisitosFuncionales.map((r) => `- ${r}`).join('\n')
  : '- El sistema deberá gestionar las funcionalidades principales del proyecto'}

## 🔒 Requisitos No Funcionales
${requisitosNoFuncionales.length > 0
  ? requisitosNoFuncionales.map((r) => `- ${r}`).join('\n')
  : '- El sistema debe ser seguro, escalable y con buen rendimiento'}

## 🛠️ Stack Tecnológico Detectado
${tecnologiasDetectadas.length > 0
  ? tecnologiasDetectadas.map((t) => `- ${t}`).join('\n')
  : '- Tecnologías estándar según el tipo de proyecto'}

## 🏗️ Arquitectura Sugerida
${obtenerArquitecturaSugerida(tipoProyecto)}

## 📁 Estructura de Carpetas Sugerida
${obtenerEstructuraCarpetas(tipoProyecto)}

## 🧩 Componentes Principales
${obtenerComponentesPrincipales(tipoProyecto)
  .map((c) => `- ${c}`)
  .join('\n')}

## 📋 Guía de Implementación
${obtenerGuiaImplementacion(tipoProyecto)
  .map((paso, i) => `${i + 1}. ${paso}`)
  .join('\n')}

## ✔️ Checklist de Desarrollo
${obtenerChecklist(tipoProyecto)
  .map((item) => `- [ ] ${item}`)
  .join('\n')}
  `.trim();

  return {
    promptFinal,
    contextoProyecto: textoOriginal.slice(0, 500),
    requisitosFuncionales,
    requisitosNoFuncionales,
    stackTecnologico: tecnologiasDetectadas,
    arquitecturaSugerida: obtenerArquitecturaSugerida(tipoProyecto),
    estructuraCarpetas: obtenerEstructuraCarpetas(tipoProyecto),
    componentesPrincipales: obtenerComponentesPrincipales(tipoProyecto),
    guiaImplementacion: obtenerGuiaImplementacion(tipoProyecto),
    checklistCompleto: obtenerChecklist(tipoProyecto),
  };
};

// Retorna el nombre legible del tipo de proyecto
const obtenerNombreTipo = (tipo) => {
  const nombres = {
    web_spa: 'Aplicación Web SPA',
    web_mpa: 'Aplicación Web MPA',
    api_rest: 'API REST',
    api_graphql: 'API GraphQL',
    movil: 'Aplicación Móvil',
    escritorio: 'Aplicación de Escritorio',
    microservicios: 'Arquitectura de Microservicios',
    cms: 'Sistema de Gestión de Contenido (CMS)',
    ecommerce: 'E-commerce',
    dashboard: 'Dashboard / Panel de Control',
  };
  return nombres[tipo] || 'Aplicación Web';
};

// Retorna la arquitectura sugerida según el tipo
const obtenerArquitecturaSugerida = (tipo) => {
  const arquitecturas = {
    web_spa: 'Arquitectura cliente-servidor con SPA en el frontend y API REST en el backend.',
    web_mpa: 'Arquitectura MVC con renderizado del lado del servidor (SSR).',
    api_rest: 'Arquitectura en capas: Rutas → Controladores → Servicios → Modelos.',
    api_graphql: 'Arquitectura GraphQL con resolvers, schemas y datasources.',
    movil: 'Arquitectura MVVM con gestión de estado centralizada.',
    escritorio: 'Arquitectura MVC con proceso principal y proceso de renderizado.',
    microservicios: 'Arquitectura de microservicios con API Gateway y comunicación por eventos.',
    cms: 'Arquitectura headless con panel de administración y API de contenido.',
    ecommerce: 'Arquitectura en capas con módulos de catálogo, carrito, pagos y usuarios.',
    dashboard: 'Arquitectura orientada a datos con pipeline de procesamiento y visualización.',
  };
  return arquitecturas[tipo] || arquitecturas['web_spa'];
};

// Retorna la estructura de carpetas según el tipo
const obtenerEstructuraCarpetas = (tipo) => {
  const estructuras = {
    web_spa: `src/\n  components/\n  pages/\n  services/\n  store/\n  utils/`,
    api_rest: `src/\n  rutas/\n  controladores/\n  servicios/\n  modelos/\n  middlewares/`,
    ecommerce: `src/\n  modulos/\n    catalogo/\n    carrito/\n    pagos/\n    usuarios/`,
    dashboard: `src/\n  componentes/\n    graficas/\n    tablas/\n    filtros/\n  servicios/`,
  };
  return estructuras[tipo] || estructuras['web_spa'];
};

// Retorna los componentes principales según el tipo
const obtenerComponentesPrincipales = (tipo) => {
  const componentes = {
    web_spa: ['Navbar', 'Router', 'AuthGuard', 'HttpInterceptor', 'NotFound'],
    api_rest: ['AuthController', 'UserController', 'ErrorMiddleware', 'JWTMiddleware'],
    ecommerce: ['ProductoCatalogo', 'CarritoCompras', 'PasarelaPagos', 'GestionPedidos'],
    dashboard: ['GraficaLineas', 'GraficaBarras', 'TablaDatos', 'FiltroFechas', 'KPICard'],
    movil: ['NavigationStack', 'AuthScreen', 'HomeScreen', 'ProfileScreen'],
  };
  return componentes[tipo] || componentes['web_spa'];
};

// Retorna la guía de implementación según el tipo
const obtenerGuiaImplementacion = (tipo) => {
  const guias = {
    web_spa: [
      'Configurar el proyecto base con el framework elegido',
      'Implementar autenticación y manejo de sesiones',
      'Crear los componentes reutilizables del diseño',
      'Implementar las vistas principales',
      'Conectar con el backend mediante servicios HTTP',
      'Agregar manejo de estado global',
      'Implementar rutas y guards de navegación',
      'Optimizar y preparar para producción',
    ],
    api_rest: [
      'Configurar el servidor y la conexión a la base de datos',
      'Definir los modelos de datos',
      'Implementar autenticación con JWT',
      'Crear las rutas y controladores CRUD',
      'Agregar validaciones y manejo de errores',
      'Documentar la API con Swagger',
      'Escribir pruebas unitarias e integración',
      'Configurar variables de entorno para producción',
    ],
  };
  return guias[tipo] || guias['web_spa'];
};

// Retorna el checklist según el tipo
const obtenerChecklist = (tipo) => {
  const checklists = {
    web_spa: [
      'Proyecto inicializado y dependencias instaladas',
      'Variables de entorno configuradas',
      'Autenticación implementada',
      'Rutas protegidas con guards',
      'Componentes principales creados',
      'Servicios HTTP configurados',
      'Manejo de errores implementado',
      'Diseño responsive aplicado',
      'Pruebas básicas escritas',
      'Build de producción generado',
    ],
    api_rest: [
      'Servidor configurado y corriendo',
      'Base de datos conectada',
      'Modelos de datos definidos',
      'Autenticación JWT implementada',
      'Rutas CRUD creadas',
      'Validaciones agregadas',
      'Manejo de errores centralizado',
      'Rate limiting configurado',
      'API documentada',
      'Variables de entorno en producción',
    ],
  };
  return checklists[tipo] || checklists['web_spa'];
};