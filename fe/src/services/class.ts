import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  IChangeClassStatusPayload,
  IFilterClassParams,
  IFilterParentClassParams,
  IUpdateClassPayload,
} from '@/types/base';
import { Class } from '@/types/class';

export const classApi = {
  getAllClasses: async (
    params?: IFilterClassParams,
  ): Promise<ApiResponse<Class[]>> => {
    const response = await apiClient.get('/classes', { params });
    return response.data;
  },

  getClassById: async (id: string): Promise<ApiResponse<Class>> => {
    const response = await apiClient.get(`/classes/${id}`);
    return response.data;
  },

  createClass: async (data: Partial<Class>): Promise<ApiResponse<Class>> => {
    const response = await apiClient.post('/classes', data);
    return response.data;
  },
  deleteClass: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/classes/${id}`);
    return response.data;
  },

  changeClassStatus: async (
    payload: IChangeClassStatusPayload,
  ): Promise<ApiResponse<Class>> => {
    const response = await apiClient.patch(`/classes/${payload.id}/status`, {
      status: payload.status,
    });
    return response.data;
  },

  updateClass: async (
    payload: IUpdateClassPayload,
  ): Promise<ApiResponse<Class>> => {
    const response = await apiClient.patch(
      `/classes/${payload.id}`,
      payload.data,
    );
    return response.data;
  },

  getClassesForParent: async (
    params?: IFilterParentClassParams,
  ): Promise<ApiResponse<Class[]>> => {
    const response = await apiClient.get('/parent/classes', { params });
    return response.data;
  },
};
