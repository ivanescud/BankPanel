import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('Debe ingresar un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  email: z.string().email('Debe ingresar un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  role: z.enum(['ADMIN', 'DEVELOPER', 'AUDITOR', 'USER']).optional(),
});

router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/register', validateBody(registerSchema), AuthController.register);
router.get('/me', authenticateToken, AuthController.getMe);
router.post('/logout', authenticateToken, AuthController.logout);

export default router;
