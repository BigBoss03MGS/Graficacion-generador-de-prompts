import { variables } from '../config/variables.js';

  /* 
  Esta funcion mejora el prompt usando varias ia en cascada (solo 3) si una de las
  tres IAs falla va con la siguiente, si en este caso todas fallan se va al prompt
  local
 
 */
export const mejorarPromptConIA = async (textoAnalizado, tipoProyecto) => {

  //Filtracion de IAs que tienen la API key 
  const iasDisponibles = variables.ias.filter(ia => ia.apiKey && ia.apiUrl);

  //Si no hay ninguna IA configurada se usara el prompt local
  if (iasDisponibles.length === 0) {
    console.log('- No hay IAs configuradas, usando prompt local');
    return null;
  }

  // Intenta con cada IA en orden hasta que una funcione
  //For con cada IA en orden hasta que una de las tres funcione
  for (const ia of iasDisponibles) {
    try {
      console.log(`- Intentando con ${ia.nombre}...`);

      const resultado = await llamarIA(ia, textoAnalizado, tipoProyecto);

      if (resultado) {
        console.log(`- Prompt mejorado con ${ia.nombre}`);
        return resultado;
      }

    } catch (error) {
      console.log(`- ${ia.nombre} falló: ${error.message}. Intentando con la siguiente...`);
      continue;
    }
  }

  //Si todas fallaron usa el prompt local
  console.log('- Todas las IAs fallaron, usando prompt local');
  return null;
};

//Decide que funcion usar segun los nombre de la IA
const llamarIA = async (ia, texto, tipoProyecto) => {
  if (ia.nombre === 'Gemini') {
    return await llamarGemini(ia, texto, tipoProyecto);
  }
  return await llamarFormatoOpenAI(ia, texto, tipoProyecto);
};

//LLama a las IAs con foramto compatible con OpoenAI
const llamarFormatoOpenAI = async (ia, texto, tipoProyecto) => {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ia.apiKey}`,
  };

  //OpenRouter necesita headers extra
  if (ia.nombre === 'OpenRouter') {
    headers['HTTP-Referer'] = 'http://localhost:3000';
    headers['X-Title'] = 'Generador de Prompts para IA';
  }

  const body = {
    model: ia.modelo,
    messages: [
      {
        role: 'system',
        content: construirSistemaPrompt(),
      },
      {
        role: 'user',
        content: construirMensajeUsuario(texto, tipoProyecto),
      },
    ],
    max_tokens: 2000,
    temperature: 0.7,
  };

  const respuesta = await fetch(`${ia.apiUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  //Si el servidor responde con error lo lanzamos para el catch
  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(
      `Error HTTP ${respuesta.status}: ${errorData?.error?.message || 'Sin detalles'}`
    );
  }

  const datos = await respuesta.json();
  return datos.choices?.[0]?.message?.content || null;
};

//LLama a la API de google gemini teniendo un formato diferente a OpenAI
const llamarGemini = async (ia, texto, tipoProyecto) => {

  //Gemini 1.0 Pro es el modelo correcto para la API 
  const modelo = 'gemini-1.0-pro';

  const respuesta = await fetch(
    `${ia.apiUrl}/models/${modelo}:generateContent?key=${ia.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${construirSistemaPrompt()}\n\n${construirMensajeUsuario(texto, tipoProyecto)}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(
      `Error HTTP ${respuesta.status}: ${JSON.stringify(errorData?.error || 'Sin detalles')}`
    );
  }

  const datos = await respuesta.json();
  return datos.candidates?.[0]?.content?.parts?.[0]?.text || null;
};

/**
 * Instrucciones que le damos a la IA sobre su rol
 */
//Instrucciones que le damos a la IA sobre su rol
const construirSistemaPrompt = () => {
  return `Eres un experto en arquitectura de software y generación 
de prompts para IAs de generación de código. Tu tarea es analizar 
documentación de proyectos y generar prompts estructurados, detallados 
y optimizados para que una IA pueda generar código de alta calidad.`;
};

//Mensaje con e documento que le enviamos a la IA
const construirMensajeUsuario = (texto, tipoProyecto) => {
  return `
Analiza la siguiente documentación de un proyecto de tipo "${tipoProyecto}" 
y genera un prompt estructurado y optimizado para que una IA pueda generar 
el código completo del proyecto.

El prompt debe incluir:
1. Contexto claro del proyecto
2. Requisitos funcionales y no funcionales separados correctamente
3. Stack tecnológico detectado
4. Arquitectura sugerida
5. Estructura de carpetas
6. Componentes principales
7. Guía de implementación paso a paso
8. Checklist de desarrollo

Documentación del proyecto:
---
${texto.slice(0, 3000)}
---

Genera el prompt en español, de forma clara, detallada y lista para usar 
en ChatGPT, Claude, Copilot u otras IAs de generación de código.
  `.trim();
};