import {
  Subscription,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
} from '@/types/subscription';
import apiClient from '@/lib/api-client';
import {
  ApiPaginatedResponse,
  ApiResponse,
  IFilterSubscriptionParams,
} from '@/types/base';

export const subscriptionApi = {
  getAll: async (
    params?: IFilterSubscriptionParams,
  ): Promise<ApiPaginatedResponse<Subscription>> => {
    const response = await apiClient.get('/subscriptions', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.get(`/subscriptions/${id}`);
    return response.data.data;
  },

  create: async (
    payload: CreateSubscriptionPayload,
  ): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post('/subscriptions', payload);
    return response.data.data;
  },

  update: async (
    id: string,
    payload: UpdateSubscriptionPayload,
  ): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.patch(`/subscriptions/${id}`, payload);
    return response.data.data;
  },

  useSession: async (id: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.patch(`/subscriptions/${id}/use`);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/subscriptions/${id}`);
  },
};
