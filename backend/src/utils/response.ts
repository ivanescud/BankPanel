import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message = 'Operación exitosa', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  },
  message = 'Datos recuperados exitosamente'
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
}

export function sendError(res: Response, message: string, statusCode = 400, details?: any) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: details,
  });
}
