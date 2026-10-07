import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, role, status, sortBy, sortOrder } = req.query;

      const result = await UserService.listUsers({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search as string,
        role: role as any,
        status: status as any,
        sortBy: sortBy as string,
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
      });

      return sendPaginated(res, result.data, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await UserService.createUser(req.body);
      return sendSuccess(res, newUser, 'Usuario creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateUser(req.params.id, req.body);
      return sendSuccess(res, updated, 'Usuario actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      return sendSuccess(res, result, 'Usuario eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
}
