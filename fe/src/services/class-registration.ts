import apiClient from '@/lib/api-client';
import {
  ClassRegistration,
  RegisterClassPayload,
} from '@/types/class-registration';

export const classRegistrationApi = {
  register: async (
    classId: string,
    payload: RegisterClassPayload,
  ): Promise<ClassRegistration> => {
    const response = await apiClient.post(
      `/classes/${classId}/register`,
      payload,
    );
    return response.data.data;
  },

  unregister: async (classId: string, studentId: string): Promise<void> => {
    await apiClient.delete(`/classes/${classId}/unregister/${studentId}`);
  },

  getByStudent: async (studentId: string): Promise<ClassRegistration[]> => {
    const response = await apiClient.get(
      `/classes/student/${studentId}/registrations`,
    );
    return response.data.data;
  },
};
