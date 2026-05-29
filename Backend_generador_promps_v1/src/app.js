import express from 'express';
import cors from 'cors';
import { manejadorErrores } from './middlewares/errores.middleware.js';
import authRutas from './rutas/auth.rutas.js';
import archivoRutas from './rutas/archivo.rutas.js';
import promptRutas from './rutas/prompt.rutas.js';
import historialRutas from './rutas/historial.rutas.js';

const app = express();

// Middlewares globales
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 Servidor funcionando correctamente' });
});

// Rutas del API
app.use('/api/auth', authRutas);
app.use('/api/archivos', archivoRutas);
app.use('/api/prompts', promptRutas);
app.use('/api/historial', historialRutas);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: `Ruta ${req.originalUrl} no encontrada`,
    datos: null,
  });
});

// Manejador de errores (siempre al final)
app.use(manejadorErrores);

export default app;