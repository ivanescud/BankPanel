import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error(`Error en ruta ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      code: 'INVALID_JSON',
      message: 'El cuerpo de la solicitud contiene JSON inválido',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  return res.status(statusCode).json({
    success: false,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
