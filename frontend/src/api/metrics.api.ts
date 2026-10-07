import api from './axios';
import { ApiResponse, DashboardMetrics, AuditLog } from '../types';

export const metricsApi = {
  getMetrics: async () => {
    const response = await api.get<ApiResponse<DashboardMetrics>>('/metrics');
    return response.data;
  },

  getRecentActivity: async (limit = 8) => {
    const response = await api.get<ApiResponse<AuditLog[]>>(`/metrics/activity?limit=${limit}`);
    return response.data;
  },
};
