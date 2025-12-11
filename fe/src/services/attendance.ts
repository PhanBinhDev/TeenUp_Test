import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/base';
import { Student } from '@/types/student';

export interface Attendance {
  id: string | null;
  classRegistrationId: string;
  subscriptionId: string | null;
  attendanceDate: string;
  status: 'present' | 'absent' | 'late' | null;
  notes: string | null;
  markedById: string | null;
  student?: Student;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MarkAttendancePayload {
  classRegistrationId: string;
  attendanceDate: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface GetAttendanceParams {
  classId: string;
  attendanceDate: string;
}

export const attendanceApi = {
  getAttendance: async (
    params: GetAttendanceParams,
  ): Promise<ApiResponse<Attendance[]>> => {
    const response = await apiClient.get('/attendances', { params });
    return response.data;
  },

  markAttendance: async (
    data: MarkAttendancePayload,
  ): Promise<ApiResponse<Attendance>> => {
    const response = await apiClient.post('/attendances/mark', data);
    return response.data;
  },
};
