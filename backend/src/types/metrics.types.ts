export interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    recentSignups: number;
  };
  accounts: {
    total: number;
    active: number;
    frozen: number;
    closed: number;
    totalBalanceUSD: number;
    byType: {
      savings: number;
      checking: number;
      investment: number;
      credit: number;
    };
  };
  systemStatus: {
    database: string;
    uptimeSeconds: number;
    timestamp: string;
  };
}
