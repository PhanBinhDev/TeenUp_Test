import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/base';

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const userApi = {
  changePassword: async (
    data: ChangePasswordDto,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch('/users/change-password', data);
    return response.data;
  },
};
