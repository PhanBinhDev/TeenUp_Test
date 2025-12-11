import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/base';

export interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  sessionsToday: number;
  hoursThisWeek: number;
}

export interface TodayScheduleItem {
  id: string;
  name: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  currentStudents: number;
  room?: string;
  subject: string;
}

export interface Teacher {
  id: string;
  userId: string;
  specialization: string | null;
  bio: string | null;
  yearsOfExperience: number | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    address: string | null;
    role: string;
  };
}

export interface UpdateTeacherDto {
  specialization?: string;
  bio?: string;
  yearsOfExperience?: number;
}

export const teacherApi = {
  getProfile: async (): Promise<ApiResponse<Teacher>> => {
    const response = await apiClient.get('/teachers/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateTeacherDto): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch('/teachers/profile', data);
    return response.data;
  },

  getStatistics: async (): Promise<ApiResponse<TeacherStats>> => {
    const response = await apiClient.get('/teachers/statistics');
    return response.data;
  },

  getTodaySchedule: async (): Promise<ApiResponse<TodayScheduleItem[]>> => {
    const response = await apiClient.get('/teachers/today-schedule');
    return response.data;
  },
};
