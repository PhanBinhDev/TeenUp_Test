import { Class } from './class';
import { ClassStatus, Gender } from './enum';
import { SubscriptionStatus } from './subscription';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: any;
  statusCode: number;
  message: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface IPageFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface IFilterClassParams extends IPageFilterParams {
  status?: ClassStatus;
  dayOfWeek?: number;
  timeSlot?: string;
  minStudents?: number;
  maxStudents?: number;
  fromDate?: string;
  toDate?: string;
}

export interface IFilterParentClassParams extends IPageFilterParams {
  status?: ClassStatus;
  dayOfWeek?: number;
  timeSlot?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IFilterStudentParams extends IPageFilterParams {
  parentId?: string;
  minAge?: number;
  maxAge?: number;
  gender?: Gender;
}

export interface IFilterSubscriptionParams extends IPageFilterParams {
  studentId?: string;
  status?: SubscriptionStatus;
  fromDate?: string;
  toDate?: string;
}

export interface IChangeClassStatusPayload {
  id: string;
  status: ClassStatus;
}

export interface IUpdateClassPayload {
  id: string;
  data: Partial<Class>;
}

export type StatusConfig = {
  [key in Class['status']]: {
    label: string;
    color: string;
  };
};

export type ModalType =
  | 'ModalAddClass'
  | 'ModalRemoveClass'
  | 'ModalChangeClassStatus'
  | 'ModalUpdateClass'
  | 'ModalAddStudent'
  | 'ModalUpdateStudent'
  | 'ModalRemoveStudent'
  | 'ModalAddSubscription'
  | 'ModalUpdateSubscription'
  | 'ModalRemoveSubscription'
  | 'ModalRegisterClass'
  | 'ModalClassDetail'
  | 'ModalConfirmUnregister';
