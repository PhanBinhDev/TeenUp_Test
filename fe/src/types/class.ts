import { ClassStatus } from './enum';
import { ITeacher } from './user';
import { ClassRegistration } from './class-registration';

export interface Class {
  id: string;
  name: string;
  subject: string;
  daysOfWeek: number[];
  timeSlot: string;
  teacherId: string;
  maxStudents: number;
  currentStudents: number;
  status: ClassStatus;
  description?: string;
  startTime: string;
  endTime: string;
  teacher: ITeacher;
  registrations?: ClassRegistration[];
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
  sunday: 'Chủ nhật',
};
