import { Router } from 'express';
import authRoutes from './auth.routes.js';
import metricsRoutes from './metrics.routes.js';
import userRoutes from './user.routes.js';
import { prisma } from '../utils/prisma.js';

const router = Router();

// Health check endpoint for Docker & monitoring
router.get('/health', async (_req, res) => {
  try {
    // Ping DB
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'CONNECTED',
      service: 'Credicord Bank Backend API',
    });
  } catch (err: any) {
    return res.status(503).json({
      status: 'DOWN',
      database: 'DISCONNECTED',
      error: err.message,
    });
  }
});

router.use('/auth', authRoutes);
router.use('/metrics', metricsRoutes);
router.use('/users', userRoutes);

export default router;
