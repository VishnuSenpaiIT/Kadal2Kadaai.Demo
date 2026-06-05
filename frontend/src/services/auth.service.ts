import apiClient from '@/lib/api-client';
import { ApiResponse } from './api.types';
import { AuthResponse, User } from './auth.types';

export const authService = {
  async me(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('api_token');
    }
  },
};
