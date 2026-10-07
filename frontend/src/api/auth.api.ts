import api from './axios';
import { ApiResponse, User } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      const response = await api.post<ApiResponse<{ loggedOut: boolean }>>('/auth/logout');
      return response.data;
    } catch {
      // Even if network fails, logout locally
      return { success: true, message: 'Sesión cerrada', data: { loggedOut: true } };
    }
  },
};
