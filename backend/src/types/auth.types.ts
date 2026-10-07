import { Role, UserStatus } from '@prisma/client';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    status: UserStatus;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
}
