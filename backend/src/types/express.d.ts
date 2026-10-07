import { Role, UserStatus } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
