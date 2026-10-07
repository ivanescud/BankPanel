import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.login({ email, password }, ipAddress, userAgent);
      return sendSuccess(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      return sendSuccess(res, user, 'Perfil recuperado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      return sendSuccess(res, user, 'Usuario registrado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
        await AuthService.logAudit('USER_LOGOUT', req.user.id, 'Cierre de sesión de usuario', ipAddress);
      }
      return sendSuccess(res, { loggedOut: true }, 'Sesión finalizada exitosamente');
    } catch (error) {
      next(error);
    }
  }
}
