import { prisma } from '../utils/prisma.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { LoginDTO, RegisterDTO } from '../types/auth.types.js';

export class AuthService {
  static async login(data: LoginDTO, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (!user) {
      throw {
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Correo electrónico o contraseña incorrectos.',
      };
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw {
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Correo electrónico o contraseña incorrectos.',
      };
    }

    if (user.status !== 'ACTIVE') {
      throw {
        statusCode: 403,
        code: 'ACCOUNT_INACTIVE',
        message: `Tu cuenta se encuentra ${user.status.toLowerCase()}. Contacta al soporte técnico de Credicord Bank.`,
      };
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    // Record login audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN',
        details: `Inicio de sesión exitoso desde ${userAgent || 'desconocido'}`,
        ipAddress: ipAddress || null,
        userId: user.id,
      },
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
            balance: true,
            currency: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      };
    }

    return user;
  }

  static async register(data: RegisterDTO) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      throw {
        statusCode: 409,
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Ya existe una cuenta registrada con este correo electrónico.',
      };
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'USER',
        status: 'ACTIVE',
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    };
  }

  static async logAudit(action: string, userId?: string, details?: string, ipAddress?: string) {
    return prisma.auditLog.create({
      data: {
        action,
        details,
        ipAddress,
        userId,
      },
    });
  }
}
