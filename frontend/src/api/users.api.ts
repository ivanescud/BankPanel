import api from './axios';
import { PaginatedResponse, ApiResponse, User } from '../types';

export interface UserFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const usersApi = {
  getUsers: async (params: UserFilterParams) => {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params,
    });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete<ApiResponse<{ id: string; message: string }>>(`/users/${id}`);
    return response.data;
  },
};
