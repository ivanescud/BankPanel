import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../utils/prisma.js';
import { Role } from '@prisma/client';

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_MISSING',
        message: 'Acceso no autorizado: Token no proporcionado',
      });
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = verifyToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
          expiredAt: err.expiredAt,
        });
      }
      return res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        message: 'Token de autenticación inválido o alterado.',
      });
    }

    // Verify user exists and is active in database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'El usuario asociado al token ya no existe.',
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        code: 'USER_INACTIVE',
        message: `La cuenta de usuario está ${user.status.toLowerCase()}. Contacte al administrador.`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRoles(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Autenticación requerida',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'No posees los permisos necesarios para realizar esta acción',
      });
    }

    next();
  };
}
