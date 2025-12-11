import { StatusConfig } from '@/types/base';
import { ClassStatus } from '@/types/enum';

export const DEFAULT_LIMIT = 10;
export const TIME_SLOTS = [
  '08:00-09:30',
  '10:00-11:30',
  '14:00-15:30',
  '16:00-17:30',
  '18:00-19:30',
];

export const STATUS_CONFIG: StatusConfig = {
  active: { label: 'Đang diễn ra', color: 'bg-green-500' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500' },
  inactive: { label: 'Chưa bắt đầu', color: 'bg-yellow-500' },
  completed: { label: 'Đã hoàn thành', color: 'bg-blue-500' },
  full: { label: 'Đầy lớp', color: 'bg-gray-500' },
};

export const STATUS_DESCRIPTIONS: Record<ClassStatus, string> = {
  active: 'Lớp học sẽ được kích hoạt và có thể tiếp tục hoạt động bình thường.',
  cancelled: 'Lớp học sẽ bị hủy. Các học sinh đã đăng ký sẽ được thông báo.',
  completed: 'Lớp học sẽ được đánh dấu là đã hoàn thành.',
  inactive: 'Lớp học sẽ tạm dừng và không thể đăng ký thêm học sinh.',
  full: 'Lớp học đã đạt đến số lượng học sinh tối đa và không thể nhận thêm học sinh.',
};

export const PACKAGE_OPTIONS = [
  {
    value: 'Gói 10 buổi',
    label: 'Gói 10 buổi',
    sessions: 10,
    durationMonths: 1,
  },
  {
    value: 'Gói 20 buổi',
    label: 'Gói 20 buổi',
    sessions: 20,
    durationMonths: 2,
  },
  {
    value: 'Gói 50 buổi',
    label: 'Gói 50 buổi',
    sessions: 50,
    durationMonths: 6,
  },
];

export const DAY_NAMES = [
  'Chủ nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];
