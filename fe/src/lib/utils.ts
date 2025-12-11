import { DAY_NAMES } from '@/constants/app';
import { ClassStatus, Gender, UserRole } from '@/types/enum';
import { SubscriptionStatus } from '@/types/subscription';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export const isServer = () => {
  return typeof window === 'undefined';
};

export const getDashboardPath = (role: UserRole) => {
  if (role === UserRole.TEACHER) {
    return '/dashboard/teacher';
  } else if (role === UserRole.PARENT) {
    return '/dashboard/parent';
  } else {
    return '/';
  }
};

export const getDayName = (dayIndex: number) => {
  return DAY_NAMES[dayIndex % 7];
};

export const getDaysOfWeekText = (daysOfWeek: number[]) => {
  return daysOfWeek.map(day => getDayName(day)).join(', ');
};

export const getStatusColor = (status: ClassStatus) => {
  switch (status) {
    case ClassStatus.ACTIVE:
      return 'bg-green-100 text-green-800';
    case ClassStatus.FULL:
      return 'bg-yellow-100 text-yellow-800';
    case ClassStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    case ClassStatus.COMPLETED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: ClassStatus) => {
  switch (status) {
    case ClassStatus.ACTIVE:
      return 'Hoạt động';
    case ClassStatus.FULL:
      return 'Đã đầy';
    case ClassStatus.CANCELLED:
      return 'Đã hủy';
    case ClassStatus.COMPLETED:
      return 'Hoàn thành';
    default:
      return status;
  }
};

export const getGenderLabel = (gender: Gender) => {
  switch (gender) {
    case Gender.MALE:
      return 'Nam';
    case Gender.FEMALE:
      return 'Nữ';
    case Gender.OTHER:
      return 'Khác';
    default:
      return gender;
  }
};

export const getSubscriptionStatusLabel = (status: SubscriptionStatus) => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return 'Đang hoạt động';
    case SubscriptionStatus.COMPLETED:
      return 'Hoàn thành';
    case SubscriptionStatus.EXPIRED:
      return 'Hết hạn';
    case SubscriptionStatus.CANCELLED:
      return 'Đã hủy';
    default:
      return status;
  }
};

export const getSubscriptionStatusColor = (status: SubscriptionStatus) => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return 'bg-green-100 text-green-800';
    case SubscriptionStatus.COMPLETED:
      return 'bg-blue-100 text-blue-800';
    case SubscriptionStatus.EXPIRED:
      return 'bg-red-100 text-red-800';
    case SubscriptionStatus.CANCELLED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
