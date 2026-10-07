import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { logger } from './utils/logger.js';
import { prisma } from './utils/prisma.js';

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middlewares
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Mount API routes
app.use('/api', routes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 'ROUTE_NOT_FOUND',
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada en este servidor`,
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Credicord Bank API corriendo en http://localhost:${PORT}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Healthcheck disponible en http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  logger.info(`Recibida señal ${signal}. Cerrando servidor gracefulmente...`);
  server.close(async () => {
    logger.info('Servidor HTTP cerrado.');
    await prisma.$disconnect();
    logger.info('Conexión con PostgreSQL finalizada.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
