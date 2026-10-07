import { Router } from 'express';
import { z } from 'zod';
import { UserController } from '../controllers/user.controller.js';
import { authenticateToken, requireRoles } from '../middleware/auth.middleware.js';
import { validateBody, validateQuery } from '../middleware/validate.middleware.js';

const router = Router();

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  role: z.enum(['ALL', 'ADMIN', 'DEVELOPER', 'AUDITOR', 'USER']).optional(),
  status: z.enum(['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const createUserSchema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  role: z.enum(['ADMIN', 'DEVELOPER', 'AUDITOR', 'USER']).optional(),
  initialAccount: z
    .object({
      accountType: z.enum(['SAVINGS', 'CHECKING', 'INVESTMENT', 'CREDIT']),
      initialBalance: z.number().min(0).default(0),
    })
    .optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  role: z.enum(['ADMIN', 'DEVELOPER', 'AUDITOR', 'USER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

router.use(authenticateToken);

router.get('/', validateQuery(querySchema), UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.post('/', requireRoles('ADMIN', 'DEVELOPER'), validateBody(createUserSchema), UserController.createUser);
router.put('/:id', requireRoles('ADMIN', 'DEVELOPER'), validateBody(updateUserSchema), UserController.updateUser);
router.delete('/:id', requireRoles('ADMIN'), UserController.deleteUser);

export default router;
