import { Router } from 'express';
import { MetricsController } from '../controllers/metrics.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protected metrics endpoints
router.get('/', authenticateToken, MetricsController.getMetrics);
router.get('/activity', authenticateToken, MetricsController.getRecentActivity);

export default router;
