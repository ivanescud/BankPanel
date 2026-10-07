export type Role = 'ADMIN' | 'DEVELOPER' | 'AUDITOR' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AccountType = 'SAVINGS' | 'CHECKING' | 'INVESTMENT' | 'CREDIT';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

export interface Account {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  accounts?: Account[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
  code?: string;
}

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

export interface AuditLog {
  id: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userId?: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
}
