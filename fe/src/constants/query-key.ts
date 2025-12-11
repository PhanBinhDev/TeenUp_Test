import {
  IFilterParentClassParams,
  IFilterStudentParams,
  IFilterSubscriptionParams,
} from '@/types/base';

export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'],
  TEACHER_CLASSES: (filter: object) => ['teacher', 'classes', filter],
  STUDENTS: (params?: IFilterStudentParams) => ['students', params],
  STUDENT_DETAIL: (id: string) => ['students', id],
  SUBSCRIPTIONS: (params?: IFilterSubscriptionParams) => [
    'subscriptions',
    params,
  ],
  SUBSCRIPTION_DETAIL: (id: string) => ['subscriptions', id],
  CLASS_REGISTRATIONS: (studentId: string) => [
    'class-registrations',
    studentId,
  ],
  PARENT_CLASSES: (params?: IFilterParentClassParams) => [
    'parent-classes',
    params,
  ],
};
