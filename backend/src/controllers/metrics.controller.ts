import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../services/metrics.service.js';
import { sendSuccess } from '../utils/response.js';

export class MetricsController {
  static async getMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await MetricsService.getDashboardMetrics();
      return sendSuccess(res, metrics, 'Métricas recuperadas exitosamente');
    } catch (error) {
      next(error);
    }
  }

  static async getRecentActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 8;
      const activity = await MetricsService.getRecentActivity(limit);
      return sendSuccess(res, activity, 'Actividad reciente recuperada exitosamente');
    } catch (error) {
      next(error);
    }
  }
}
