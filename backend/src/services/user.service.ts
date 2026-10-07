import { prisma } from '../utils/prisma.js';
import { UserQueryParams, PaginatedResult } from '../types/user.types.js';
import { hashPassword } from '../utils/password.js';
import { Prisma, Role, UserStatus } from '@prisma/client';

export class UserService {
  static async listUsers(params: UserQueryParams): Promise<PaginatedResult<any>> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    // Search query (name, email, account number)
    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        {
          accounts: {
            some: {
              accountNumber: { contains: q, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    // Role filter
    if (params.role && params.role !== 'ALL') {
      where.role = params.role as Role;
    }

    // Status filter
    if (params.status && params.status !== 'ALL') {
      where.status = params.status as UserStatus;
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      };
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
    initialAccount?: {
      accountType: 'SAVINGS' | 'CHECKING' | 'INVESTMENT' | 'CREDIT';
      initialBalance: number;
    };
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      throw {
        statusCode: 409,
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'El correo electrónico ya se encuentra registrado.',
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
        ...(data.initialAccount
          ? {
              accounts: {
                create: {
                  accountNumber: `CCB-${Math.floor(10000000 + Math.random() * 90000000)}`,
                  accountType: data.initialAccount.accountType,
                  balance: data.initialAccount.initialBalance || 0,
                  currency: 'USD',
                  status: 'ACTIVE',
                },
              },
            }
          : {}),
      },
      include: {
        accounts: true,
      },
    });

    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async updateUser(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      role?: Role;
      status?: UserStatus;
    }
  ) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      };
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  static async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      };
    }

    await prisma.user.delete({ where: { id } });
    return { id, message: 'Usuario eliminado exitosamente' };
  }
}
