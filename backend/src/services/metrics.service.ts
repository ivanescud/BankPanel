import { prisma } from '../utils/prisma.js';
import { DashboardMetrics } from '../types/metrics.types.js';

export class MetricsService {
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      recentSignups,
      totalAccounts,
      activeAccounts,
      frozenAccounts,
      closedAccounts,
      balanceAggregate,
      accountsByTypeRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'INACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.account.count(),
      prisma.account.count({ where: { status: 'ACTIVE' } }),
      prisma.account.count({ where: { status: 'FROZEN' } }),
      prisma.account.count({ where: { status: 'CLOSED' } }),
      prisma.account.aggregate({
        _sum: { balance: true },
      }),
      prisma.account.groupBy({
        by: ['accountType'],
        _count: { id: true },
      }),
    ]);

    const byType = {
      savings: 0,
      checking: 0,
      investment: 0,
      credit: 0,
    };

    for (const group of accountsByTypeRaw) {
      if (group.accountType === 'SAVINGS') byType.savings = group._count.id;
      if (group.accountType === 'CHECKING') byType.checking = group._count.id;
      if (group.accountType === 'INVESTMENT') byType.investment = group._count.id;
      if (group.accountType === 'CREDIT') byType.credit = group._count.id;
    }

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        suspended: suspendedUsers,
        recentSignups,
      },
      accounts: {
        total: totalAccounts,
        active: activeAccounts,
        frozen: frozenAccounts,
        closed: closedAccounts,
        totalBalanceUSD: balanceAggregate._sum.balance || 0,
        byType,
      },
      systemStatus: {
        database: 'Connected (PostgreSQL)',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
    };
  }

  static async getRecentActivity(limit = 8) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }
}
