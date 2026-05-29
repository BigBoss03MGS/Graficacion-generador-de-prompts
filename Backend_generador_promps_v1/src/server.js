import app from './app.js';
import { conectarDB } from './config/db.js';
import { variables } from './config/variables.js';

const iniciarServidor = async () => {
  await conectarDB();

  app.listen(variables.puerto, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${variables.puerto}`);
    console.log(`📦 Entorno: ${variables.entorno}`);
  });
};

iniciarServidor();