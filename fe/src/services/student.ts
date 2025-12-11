import {
  Student,
  CreateStudentPayload,
  UpdateStudentPayload,
} from '@/types/student';
import apiClient from '@/lib/api-client';
import {
  ApiPaginatedResponse,
  ApiResponse,
  IFilterStudentParams,
} from '@/types/base';

export const studentApi = {
  getAll: async (
    params?: IFilterStudentParams,
  ): Promise<ApiPaginatedResponse<Student>> => {
    const response = await apiClient.get('/students', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Student>> => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data.data;
  },

  create: async (
    payload: CreateStudentPayload,
  ): Promise<ApiResponse<Student>> => {
    const response = await apiClient.post('/students', payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateStudentPayload,
  ): Promise<Student> => {
    const response = await apiClient.patch(`/students/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};
