import { Role, UserStatus } from '@prisma/client';

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role | 'ALL';
  status?: UserStatus | 'ALL';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
