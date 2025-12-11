import apiClient from '@/lib/api-client';
import { AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/base';
import { IUser } from '@/types/user';

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'parent' | 'teacher';
  address?: string;
  occupation?: string;
  specialization?: string;
  bio?: string;
  yearsOfExperience?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterDto): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<ApiResponse<IUser>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
