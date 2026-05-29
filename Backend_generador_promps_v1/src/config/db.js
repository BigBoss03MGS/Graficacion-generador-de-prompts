import mongoose from 'mongoose'; //Libreria para el uso de node.js y mongodb
import { variables } from './variables.js'; 


//Funcion para conectarse a la base de datos de mongodb
export const conectarDB = async () => {
  try {
    //Se conecta a la base de datos apartir de el archivo .env y muestra un mensaje de confirmacion
    await mongoose.connect(variables.mongodbUri);
    console.log('- MongoDB conectado correctamente');
  } catch (error) {
    //En dado caso que la base de datos no se conecte retorna a un mensaje de error y termina el proceso del servidor
    console.error('- Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};