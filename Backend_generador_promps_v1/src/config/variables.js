//Archivo que lee el archivo .env

//Libreria para leer el archivo .env
import dotenv from 'dotenv';
//Abre y lee el archivo .env
dotenv.config();

//Objeto que almacena las variables que contiene el archivo .env
export const variables = {
  puerto: process.env.PUERTO || 3000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecreto: process.env.JWT_SECRETO,
  //Tiempo de vida del JWT despues de esos dias el usuario tiene que iniciar sesion
  jwtExpiracion: process.env.JWT_EXPIRACION || '7d',
  /*
  Apis de las IAs
  si una IA falla pasa a la siguiente de manera automatica
  si todas fallan se va al generador local
  
  */
  ias: [
    {
      nombre: 'Groq',
      apiKey: process.env.IA_PRINCIPAL_KEY,
      apiUrl: process.env.IA_PRINCIPAL_URL,
      // llama3-8b-8192 fue deprecado, usar llama-3.1-8b-instant
      modelo: process.env.IA_PRINCIPAL_MODELO || 'llama-3.1-8b-instant',
    },
    {
      nombre: 'Gemini',
      apiKey: process.env.IA_RESPALDO_KEY,
      apiUrl: process.env.IA_RESPALDO_URL,
      modelo: process.env.IA_RESPALDO_MODELO || 'gemini-1.0-pro',
    },
    {
      nombre: 'OpenRouter',
      apiKey: process.env.IA_TERCIARIA_KEY,
      apiUrl: process.env.IA_TERCIARIA_URL,
      modelo: process.env.IA_TERCIARIA_MODELO || 'meta-llama/llama-3-8b-instruct:free',
    },
  ],
  entorno: process.env.ENTORNO || 'desarrollo',
};